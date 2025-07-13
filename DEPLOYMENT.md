# Deployment Guide 🚀

This guide covers deploying the AI Resume Analyzer to production environments.

## Frontend Deployment (Firebase Hosting)

### 1. Build the Application

```bash
cd my-app
npm run build
```

### 2. Initialize Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

Select the following options:
- Use an existing project
- Public directory: `build`
- Configure as single-page app: `Yes`
- Set up automatic builds: `No`

### 3. Deploy to Firebase

```bash
firebase deploy --only hosting
```

## Backend Deployment (Google Cloud Functions)

### 1. Install Google Cloud CLI

```bash
# Download and install from: https://cloud.google.com/sdk/docs/install
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Deploy Cloud Function

```bash
cd backend
gcloud functions deploy analyzeResume \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=your_openai_api_key \
  --region us-central1
```

### 3. Get Function URL

```bash
gcloud functions describe analyzeResume --region us-central1
```

Update your frontend environment variables with the function URL.

## Environment Variables

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://us-central1-YOUR_PROJECT.cloudfunctions.net/analyzeResume
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Backend (Cloud Function Environment)

```bash
gcloud functions deploy analyzeResume \
  --set-env-vars OPENAI_API_KEY=your_openai_api_key,GOOGLE_CLOUD_PROJECT=your_project_id
```

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Set up security rules

### 2. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /resume_analyses/{document} {
      allow read, write: if true; // For demo - restrict in production
    }
  }
}
```

## Monitoring & Logging

### Cloud Function Logs

```bash
gcloud functions logs read analyzeResume --region us-central1
```

### Firebase Analytics

Enable Firebase Analytics in your project for user insights.

## Production Checklist

- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerts
- [ ] Test all functionality in production
- [ ] Set up backup strategies
- [ ] Configure rate limiting
- [ ] Set up error tracking (Sentry)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Cloud Function allows your domain
2. **PDF Parsing Failures**: Check file size limits and format
3. **AI Analysis Timeouts**: Increase function timeout if needed
4. **Firebase Connection**: Verify API keys and project settings

### Debug Commands

```bash
# Test Cloud Function locally
cd backend
npm start

# Check function logs
gcloud functions logs read analyzeResume --limit 50

# Test function directly
curl -X POST https://us-central1-YOUR_PROJECT.cloudfunctions.net/analyzeResume \
  -H "Content-Type: multipart/form-data" \
  -F "resume=@test.pdf"
``` 