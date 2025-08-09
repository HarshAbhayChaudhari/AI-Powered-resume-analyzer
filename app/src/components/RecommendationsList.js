import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Chip,
  Box,
  Typography
} from '@mui/material';
import { 
  CheckCircle, 
  Warning, 
  Error, 
  Lightbulb,
  TrendingUp,
  School,
  Work
} from '@mui/icons-material';

const RecommendationsList = ({ recommendations }) => {
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'improvement':
        return <Warning color="warning" />;
      case 'critical':
        return <Error color="error" />;
      case 'suggestion':
        return <Lightbulb color="info" />;
      default:
        return <CheckCircle color="success" />;
    }
  };

  const getRecommendationColor = (type) => {
    switch (type) {
      case 'improvement':
        return 'warning';
      case 'critical':
        return 'error';
      case 'suggestion':
        return 'info';
      default:
        return 'success';
    }
  };

  const categorizeRecommendations = (recs) => {
    const categories = {
      skills: [],
      experience: [],
      education: [],
      format: [],
      general: []
    };

    recs.forEach(rec => {
      if (rec.toLowerCase().includes('skill') || rec.toLowerCase().includes('keyword')) {
        categories.skills.push(rec);
      } else if (rec.toLowerCase().includes('experience') || rec.toLowerCase().includes('work')) {
        categories.experience.push(rec);
      } else if (rec.toLowerCase().includes('education') || rec.toLowerCase().includes('degree')) {
        categories.education.push(rec);
      } else if (rec.toLowerCase().includes('format') || rec.toLowerCase().includes('layout')) {
        categories.format.push(rec);
      } else {
        categories.general.push(rec);
      }
    });

    return categories;
  };

  const categories = categorizeRecommendations(recommendations);
  const categoryIcons = {
    skills: <Work />,
    experience: <TrendingUp />,
    education: <School />,
    format: <CheckCircle />,
    general: <Lightbulb />
  };

  const categoryLabels = {
    skills: 'Skills & Keywords',
    experience: 'Experience',
    education: 'Education',
    format: 'Format & Layout',
    general: 'General'
  };

  return (
    <Box>
      {Object.entries(categories).map(([category, recs]) => {
        if (recs.length === 0) return null;
        
        return (
          <Box key={category} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {categoryIcons[category]}
              <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>
                {categoryLabels[category]}
              </Typography>
              <Chip 
                label={recs.length} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }}
              />
            </Box>
            
            <List dense>
              {recs.map((recommendation, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {getRecommendationIcon('suggestion')}
                  </ListItemIcon>
                  <ListItemText 
                    primary={recommendation}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );
      })}
    </Box>
  );
};

export default RecommendationsList; 