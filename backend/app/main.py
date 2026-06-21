from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import httpx

app = FastAPI(title="ICFScope API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Service URL (can be configured via environment variable)
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001")

@app.get("/")
async def root():
    return {"message": "ICFScope API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ICFScope Backend"}

@app.post("/api/ocr/pdf")
async def ocr_pdf_proxy(file: UploadFile = File(...)):
    """Proxy OCR requests to the AI service"""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Forward the file to the AI service
        files = {"file": (file.filename, await file.read(), file.content_type)}
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{AI_SERVICE_URL}/ocr/pdf", files=files)
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

@app.post("/api/parse/pdf")
async def parse_pdf_proxy(file: UploadFile = File(...)):
    """Proxy full PDF parsing requests to the AI service"""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Forward the file to the AI service
        files = {"file": (file.filename, await file.read(), file.content_type)}
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{AI_SERVICE_URL}/parse/pdf", files=files)
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF parsing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

