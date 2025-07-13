import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { 
  CloudUpload, 
  Description, 
  CheckCircle, 
  Error 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import { analyzeResume } from '../services/analysisService';

const ResumeUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const { setLoading, setAnalysisResult, setError, addToHistory } = useAnalysis();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setFileError(null);
    
    if (rejectedFiles.length > 0) {
      setFileError('Please upload a valid PDF file (max 10MB)');
      return;
    }

    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    } else {
      setFileError('Please upload a PDF file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await analyzeResume(uploadedFile);
      
      setAnalysisResult(result);
      addToHistory({
        ...result,
        fileName: uploadedFile.name,
        uploadDate: new Date().toISOString()
      });
      
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to analyze resume');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        AI-Powered Resume Analyzer
      </Typography>
      
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Upload your resume (PDF) to get AI-driven insights, ATS compatibility scores, and personalized recommendations
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            {...getRootProps()}
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              backgroundColor: isDragActive ? 'primary.50' : 'background.paper',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'primary.50'
              }
            }}
          >
            <input {...getInputProps()} />
            
            {uploadedFile ? (
              <Box>
                <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  File Ready for Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {uploadedFile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  or click to browse
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supports PDF files up to 10MB
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                What we analyze:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Skills & Keywords
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Experience & Education
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  ATS Compatibility Score
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Action-oriented Language
                </Typography>
                <Typography component="li" variant="body2">
                  Personalized Recommendations
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {fileError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {fileError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleAnalyze}
          disabled={!uploadedFile}
          startIcon={<Description />}
          sx={{ minWidth: 200 }}
        >
          Analyze Resume
        </Button>
      </Box>
    </Box>
  );
};

export default ResumeUpload; 