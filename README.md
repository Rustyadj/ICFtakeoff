# ICFScope - Advanced OCR & AI Plan Analysis

🚀 **ICFScope** is a comprehensive full-stack application for ICF (Insulated Concrete Form) construction plan analysis, featuring advanced OCR, AI object detection, and automated takeoff calculations.

**Last Updated:** September 9, 2025

## 🏗️ Architecture Overview

ICFScope now features a **microservices architecture** with specialized components:

```
ICFScope/
├── frontend/          # Vite + React frontend (Vercel deployment)
├── backend/           # FastAPI API gateway (Render deployment)
├── ai/               # AI/OCR service with Tesseract + YOLO
├── .github/workflows/ # Automated CI/CD pipelines
└── docker-compose.yml # Local development orchestration
```

## 🧠 AI & OCR Capabilities

### **Tesseract OCR Integration**
- **PDF-to-Text Extraction**: Convert construction plans to searchable text
- **Multi-page Processing**: Handle complex plan sets with multiple sheets
- **Preprocessing Pipeline**: Image enhancement for better OCR accuracy

### **YOLO Object Detection**
- **Wall Detection**: Automatically identify ICF walls in plan drawings
- **Opening Recognition**: Detect doors, windows, and penetrations
- **Structural Elements**: Identify columns, beams, and load-bearing components

### **PostGIS Geometry Processing**
- **Spatial Analysis**: Convert detected elements to precise geometric data
- **Measurement Calculations**: Automatic wall length and area calculations
- **3D Modeling Support**: Generate data for Three.js visualization

### **Database Integration**
- **MongoDB**: Store detection results and project metadata
- **PostgreSQL + PostGIS**: Manage geometric data and spatial queries
- **Redis**: Cache frequently accessed data for performance

## 🚀 Quick Start

### **Local Development (Docker)**

1. **Clone and setup:**
   ```bash
   git clone https://github.com/Rustyadj/ICFtakeoff.git
   cd ICFtakeoff
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - AI Service: http://localhost:8001

### **API Endpoints**

#### **OCR Processing**
```bash
# Extract text from PDF plans
POST /api/ocr/pdf
Content-Type: multipart/form-data
Body: file (PDF)
```

#### **Full Plan Analysis**
```bash
# Complete analysis: OCR + Detection + Geometry
POST /api/parse/pdf
Content-Type: multipart/form-data
Body: file (PDF)
```

#### **Health Checks**
```bash
GET /health          # Backend status
GET /ai/health       # AI service status
```

## 🛠️ Technology Stack

### **Frontend**
- **React 19** with **Vite** for the frontend application
- **Three.js** for 3D wall visualization
- **Tailwind CSS** for responsive design
- **Zustand** for state management

### **Backend Services**
- **FastAPI** for high-performance API gateway
- **Tesseract OCR** for text extraction
- **YOLO (Ultralytics)** for object detection
- **OpenCV** for image preprocessing

### **Data & Storage**
- **PostgreSQL + PostGIS** for spatial data
- **MongoDB** for document storage
- **Redis** for caching and sessions
- **DigitalOcean Spaces** for file storage

### **Infrastructure**
- **Docker** for containerization
- **GitHub Actions** for CI/CD
- **Vercel** for frontend deployment
- **Render** for backend services

## 📋 Features

### **Plan Analysis**
- ✅ **PDF Upload & Processing**
- ✅ **Multi-page Plan Support**
- ✅ **OCR Text Extraction**
- ✅ **AI Wall Detection**
- ✅ **Opening Recognition**
- ✅ **Geometric Calculations**

### **Visualization**
- ✅ **Interactive Plan Viewer**
- ✅ **3D Wall Models**
- ✅ **Color-coded Height Mapping**
- ✅ **Measurement Overlays**

### **Takeoff Calculations**
- ✅ **Automated Block Counting**
- ✅ **Concrete Volume Calculations**
- ✅ **Multi-manufacturer Support**
- ✅ **Material Cost Estimation**

### **Integration**
- ✅ **RESTful API**
- ✅ **Real-time Processing**
- ✅ **Export Capabilities**
- ✅ **Project Management**

## 🔧 Configuration

### **Environment Variables**

#### **Backend (.env)**
```bash
AI_SERVICE_URL=http://ai:8001
DATABASE_URL=postgresql://postgres:password@postgres:5432/icfdb
MONGO_URL=mongodb://mongo:27017/
REDIS_URL=redis://redis:6379
```

#### **AI Service (.env)**
```bash
YOLO_MODEL_PATH=yolov8n.pt
POSTGRES_URL=postgresql://postgres:password@postgres:5432/icfdb
MONGO_URL=mongodb://mongo:27017/
```

#### **Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8001
```

## 🚀 Deployment

### **Automated Deployment**
Every push to `main` triggers automated deployment:
1. **Backend** → Render
2. **Frontend** → Vercel
3. **AI Service** → Render (separate instance)

### **Production Setup**

#### **Required Secrets (GitHub)**
- `RENDER_API_KEY`
- `RENDER_BACKEND_SERVICE_ID`
- `RENDER_AI_SERVICE_ID`
- `VERCEL_TOKEN`

#### **Database Setup**
- **Managed PostgreSQL** with PostGIS extension
- **MongoDB Atlas** for document storage
- **Redis Cloud** for caching

## 📊 Performance Considerations

### **OCR Optimization**
- **GPU Acceleration**: Use GPU instances for YOLO inference
- **Batch Processing**: Process multiple pages in parallel
- **Image Preprocessing**: Optimize images before OCR

### **Scalability**
- **Horizontal Scaling**: Multiple AI service instances
- **Load Balancing**: Distribute OCR workload
- **Caching Strategy**: Redis for frequently accessed data

## 🔒 Security

- **File Validation**: Strict PDF format checking
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Secure cross-origin requests
- **Environment Secrets**: Secure credential management

## 📈 Monitoring

- **Health Checks**: Service availability monitoring
- **Performance Metrics**: Response time tracking
- **Error Logging**: Comprehensive error reporting
- **Usage Analytics**: API endpoint usage statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for ICF construction analysis.

---

**Repository**: https://github.com/Rustyadj/ICFtakeoff
**Live Demo**: https://icfscope.vercel.app  
**API Documentation**: https://icfscope-backend.onrender.com/docs
