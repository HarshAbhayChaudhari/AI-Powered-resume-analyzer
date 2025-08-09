import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { CheckCircle, Warning, Error } from '@mui/icons-material';

const ScoreCard = ({ title, score, maxScore = 100, color = 'primary', icon }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle color="success" />;
    if (score >= 60) return <Warning color="warning" />;
    return <Error color="error" />;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="span" sx={{ mr: 2 }}>
            {score}/{maxScore}
          </Typography>
          {getScoreIcon(score)}
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={(score / maxScore) * 100} 
          color={getScoreColor(score)}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </CardContent>
    </Card>
  );
};

export default ScoreCard; 