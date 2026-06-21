from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
import pytesseract
import cv2
import numpy as np
from pdf2image import convert_from_bytes
from shapely.geometry import LineString, Polygon, mapping
import pyclipper
import os
from ultralytics import YOLO
from pymongo import MongoClient
from sqlalchemy import create_engine, text
import uuid
import io

# Environment config (expect these env vars in production/docker)
POSTGRES_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:password@postgres:5432/icfdb')
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://mongo:27017/')
S3_BUCKET = os.getenv('S3_BUCKET', '')  # optional

app = FastAPI(title='ICF Scope Backend')

# DB clients (simple)
mongo = MongoClient(MONGO_URL)
mdb = mongo.get_database('icfscope')
engine = create_engine(POSTGRES_URL, echo=False, future=True)

# Try to load a YOLO model if provided via env var (path or hub model)
YOLO_MODEL = os.getenv('YOLO_MODEL_PATH', 'yolov8n.pt')  # small default; may not exist
yolo = None
try:
    yolo = YOLO(YOLO_MODEL)
except Exception as e:
    print('YOLO model not loaded:', e)
    yolo = None

def run_tesseract_on_image_bytes(img_bytes: bytes):
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        return ''
    # basic preprocessing
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # adaptive threshold helps with some plans
    text = pytesseract.image_to_string(gray)
    return text

@app.get('/')
def root():
    return {'message': 'ICF Scope Backend with OCR & detection placeholders'}

@app.post('/ocr/pdf')
async def ocr_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.pdf',)):
        raise HTTPException(status_code=400, detail='Only PDF files supported for this endpoint.')
    contents = await file.read()
    try:
        pages = convert_from_bytes(contents, dpi=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'pdf2image error: {e}')
    results = []
    for i, page in enumerate(pages):
        buf = io.BytesIO()
        page.save(buf, format='PNG')
        page_bytes = buf.getvalue()
        text = run_tesseract_on_image_bytes(page_bytes)
        results.append({'page': i+1, 'text': text})
    return JSONResponse({'pages': results})

@app.post('/parse/pdf')
async def parse_pdf(file: UploadFile = File(...)):
    # Full pipeline: pdf -> images -> OCR -> detection -> geometry -> store
    contents = await file.read()
    pages = convert_from_bytes(contents, dpi=200)
    all_geo = []
    detections_all = []
    for i, page in enumerate(pages):
        buf = io.BytesIO()
        page.save(buf, format='PNG')
        page_bytes = buf.getvalue()
        # OCR
        ocr_text = run_tesseract_on_image_bytes(page_bytes)
        # Detection (YOLO) - if model available
        detections = []
        if yolo:
            try:
                res = yolo.predict(source=page_bytes, stream=False, save=False)
                # res is list of Results; we convert boxes to simple dicts
                for r in res:
                    for box in r.boxes:
                        xyxy = box.xyxy.tolist()[0]
                        conf = float(box.conf.tolist()[0])
                        cls = int(box.cls.tolist()[0])
                        detections.append({'xyxy': xyxy, 'conf': conf, 'cls': cls})
            except Exception as e:
                detections.append({'error': f'yolo predict error: {e}'})
        else:
            # placeholder detection -- in real use replace with model inference
            detections.append({'note': 'YOLO not loaded; returning placeholder', 'page': i+1})

        # Geometry processing placeholder: convert detections into LineStrings
        # Here we'll create a fake wall line for demo purposes
        line = LineString([(0,0),(10,0)])  # units are arbitrary
        all_geo.append({'page': i+1, 'geom': mapping(line), 'height_ft': 8.0})

        detections_all.append({'page': i+1, 'detections': detections, 'ocr_text': ocr_text})

    # Store results in MongoDB
    project_id = str(uuid.uuid4())
    mdb.parses.insert_one({'project_id': project_id, 'detections': detections_all})

    # Store geometries in PostGIS (requires PostGIS enabled DB)
    try:
        with engine.begin() as conn:
            conn.execute(text("""CREATE TABLE IF NOT EXISTS parsed_walls (
                id UUID PRIMARY KEY,
                project_id TEXT,
                geom geometry,
                height_ft numeric
            );"""))
            for g in all_geo:
                wid = str(uuid.uuid4())
                # Using ST_GeomFromText for simplicity - in production use parameterized queries
                wkt = 'LINESTRING(0 0, 10 0)'
                conn.execute(text("INSERT INTO parsed_walls (id, project_id, geom, height_ft) VALUES (:id, :pid, ST_GeomFromText(:wkt, 4326), :h)"),
                             [{"id": wid, "pid": project_id, "wkt": wkt, "h": g.get('height_ft', 8.0)}])
    except Exception as e:
        print('Postgres insert error:', e)

    return {'project_id': project_id, 'pages': len(pages), 'detections_sample': detections_all[:2]}
