# AI‑Powered Resume Analyzer 🧠📄

**A full‑stack web app that parses PDF resumes, analyses key elements using AI, and delivers personalized feedback — built with React, Google Cloud Functions, and Google Firestore.**

---

## 🔍 Table of Contents
- [Project Overview](#project-overview)  
- [Key Features](#key-features)  
- [Architecture](#architecture)  
- [Tech Stack](#tech-stack)  
- [Installation & Setup](#installation--setup)  
- [Usage](#usage)  
- [Demo](#demo)  
- [Roadmap](#roadmap)  
- [Contributing](#contributing)  
- [License](#license)

---

## 🎯 Project Overview

The Resume Analyzer empowers users to upload resumes (PDF) and receive AI‑driven assessments. It extracts key sections — skills, experience, education, and contact info — scores them for ATS friendliness, and offers actionable recommendations (e.g., missing keywords, format improvements). Designed as a real‑world tool, it showcases serverless architecture and scalable AI integration.

---

## ✨ Key Features

- **📌 Resume Upload**: Supports PDF uploads via React frontend with drag-and-drop functionality
- **🧩 AI Analysis**:  
  - Keyword extraction and skills identification
  - Section classification (skills, experience, education)
  - ATS compliance scoring
  - Personalized recommendations
- **📊 Dashboard**: Visual scorecards and feedback breakdown with charts
- **🔁 Serverless Backend**: Built with Google Cloud Functions & Firestore
- **🗃️ Persistent Storage**: Stores analysis results tied to user/session
- **🚀 Modern UI**: Beautiful Material-UI interface with responsive design

---

## 🏗 Architecture

```
[ React Frontend ]
↕ Axios/Fetch ↔
[ Cloud Functions (Node.js + AI Modules) ]
↕ Firestore ↔
[ Analysis Results Database ]
```

- **Frontend**: Handles uploads, displays results with interactive charts
- **Cloud Functions**: Parse PDFs, apply NLP/ML, compute scores
- **Firestore**: Stores request/response history for dashboards

---

## 🛠 Tech Stack

| Layer       | Technology                                                        |
|-------------|--------------------------------------------------------------------|
| Frontend    | React.js, Material-UI, PDF.js, React Dropzone, Recharts          |
| Backend     | Google Cloud Functions (Node.js), OpenAI API (GPT)               |
| Database    | Firebase Firestore                                                |
| Parsing + NLP | pdf-parse, OpenAI GPT-3.5-turbo, Natural language processing    |
| Package Manager | Bun (recommended) or npm                                         |
| DevOps      | Firebase Hosting, Google Cloud CLI                                |

---

## 🧭 Installation & Setup

### Prerequisites

- **Package Manager**: Bun ≥1.0.0 (recommended) or Node.js ≥14.x & npm
- Google Cloud account + Firebase CLI & project  
- OpenAI API key (for production AI features)

### Installing Bun (if not already installed)

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (with WSL)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

### Clone & Install

```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer

# Install all dependencies using Bun (recommended)
bun install

# Or install frontend and backend separately:
# Frontend
cd my-app
bun install

# Backend  
cd ../backend
bun install
```

### Alternative: Using npm (legacy)

If you prefer to use npm instead of Bun:

```bash
# Install frontend dependencies
cd my-app
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Environment Setup

Create a `.env` file in the `my-app` directory:

```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Backend Setup

1. **Google Cloud Functions Setup**:
   ```bash
   cd backend
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Environment Variables for Cloud Functions**:
   ```bash
   gcloud functions deploy analyzeResume \
     --runtime nodejs18 \
     --trigger-http \
     --allow-unauthenticated \
     --set-env-vars OPENAI_API_KEY=your_openai_api_key
   ```

### Start Development

```bash
# Using Bun (recommended)
# Start frontend (in my-app directory)
cd my-app
bun start
# or
bun dev

# Start backend locally (in backend directory)
cd backend
bun start
# or
bun dev
```

### Using npm (legacy)

```bash
# Start frontend (in my-app directory)
cd my-app
npm start

# Start backend locally (in backend directory)
cd backend
npm start
```

---

## 🚀 Usage

1. **Upload Resume**: Drag and drop or click to upload a PDF resume
2. **AI Analysis**: The system extracts text and performs AI-powered analysis
3. **View Results**: See your ATS compatibility score, skills breakdown, and recommendations
4. **Dashboard**: Access your analysis history and detailed insights

### Example Analysis Output

```yaml
Overall Score: 78/100
✅ Strong: Technical Skills, Education
⚠️ Needs Improvement: Action‑oriented bullets, Job‑description keywords
💡 Suggestions: Include "RESTful APIs", quantify achievements, add "React" and "TypeScript"
```

---

## 🎨 Demo

The application features:

- **Modern UI**: Clean, responsive Material-UI design
- **Interactive Charts**: Skills distribution visualization
- **Real-time Analysis**: Instant feedback with loading states
- **Comprehensive Dashboard**: Score breakdowns and recommendations
- **Upload History**: Track previous analyses

---

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ PDF parsing and text extraction
- ✅ Basic AI analysis with OpenAI
- ✅ Frontend dashboard
- ✅ Skills extraction and scoring

### Phase 2 (Planned)
- 🔄 Advanced NLP with custom models
- 🔄 Job-specific keyword matching
- 🔄 Resume comparison tools
- 🔄 Export functionality

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Advanced ATS optimization
- 📋 Integration with job boards
- 📋 Resume builder integration

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Use TypeScript for new components
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Google Cloud for serverless infrastructure
- Material-UI for beautiful components
- PDF.js for PDF parsing capabilities

---

## 📞 Support

For support, email support@resume-analyzer.com or create an issue in this repository.

---

**Built with ❤️ for better job applications**
