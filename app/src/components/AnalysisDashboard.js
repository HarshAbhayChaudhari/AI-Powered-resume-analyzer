import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Alert
} from '@mui/material';
import { 
  CheckCircle, 
  Warning, 
  Error, 
  TrendingUp,
  School,
  Work,
  Code,
  Lightbulb,
  Description
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import ScoreCard from './ScoreCard';
import SkillsChart from './SkillsChart';
import RecommendationsList from './RecommendationsList';

const AnalysisDashboard = () => {
  const { analysisResult, error, uploadHistory } = useAnalysis();
  const navigate = useNavigate();

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Try Again
        </Button>
      </Box>
    );
  }

  if (!analysisResult) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          No Analysis Results
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Upload a resume to see your analysis results
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Upload Resume
        </Button>
      </Box>
    );
  }

  const { 
    overallScore, 
    sectionScores, 
    skills, 
    recommendations, 
    extractedText,
    fileName 
  } = analysisResult;

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle />;
    if (score >= 60) return <Warning />;
    return <Error />;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Analysis Results
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Analyze Another Resume
        </Button>
      </Box>

      {fileName && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Analyzed: {fileName}
        </Alert>
      )}

      {/* Overall Score */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              Overall ATS Compatibility Score
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h3" component="span" sx={{ mr: 2 }}>
              {overallScore}/100
            </Typography>
            {getScoreIcon(overallScore)}
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={overallScore} 
            color={getScoreColor(overallScore)}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Section Scores */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Section Breakdown
              </Typography>
              
              {Object.entries(sectionScores).map(([section, score]) => (
                <Box key={section} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {section.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {score}/100
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={score} 
                    color={getScoreColor(score)}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Skills Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Code sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Skills & Keywords
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                ))}
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {skills.length} skills detected
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Lightbulb sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">
                  Recommendations
                </Typography>
              </Box>
              
              <RecommendationsList recommendations={recommendations} />
            </CardContent>
          </Card>
        </Grid>

        {/* Extracted Text Preview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Extracted Content Preview
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  maxHeight: 200, 
                  overflow: 'auto',
                  backgroundColor: 'grey.50',
                  p: 2,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}
              >
                {extractedText.substring(0, 500)}...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload History */}
      {uploadHistory.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Analyses
            </Typography>
            <List>
              {uploadHistory.slice(0, 5).map((analysis, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText
                      primary={analysis.fileName}
                      secondary={`Score: ${analysis.overallScore}/100 • ${new Date(analysis.uploadDate).toLocaleDateString()}`}
                    />
                    <Chip 
                      label={`${analysis.overallScore}/100`}
                      color={getScoreColor(analysis.overallScore)}
                      size="small"
                    />
                  </ListItem>
                  {index < uploadHistory.slice(0, 5).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AnalysisDashboard; 