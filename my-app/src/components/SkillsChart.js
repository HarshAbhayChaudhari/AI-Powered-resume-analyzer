import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Code } from '@mui/icons-material';

const SkillsChart = ({ skills }) => {
  // Categorize skills for visualization
  const categorizeSkills = (skillsList) => {
    const categories = {
      'Programming Languages': [],
      'Frameworks & Libraries': [],
      'Tools & Technologies': [],
      'Soft Skills': [],
      'Other': []
    };

    const programmingLanguages = ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript'];
    const frameworks = ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'asp.net', 'jquery', 'bootstrap'];
    const tools = ['git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'jira', 'figma', 'postgresql', 'mongodb', 'redis'];

    skillsList.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (programmingLanguages.includes(skillLower)) {
        categories['Programming Languages'].push(skill);
      } else if (frameworks.includes(skillLower)) {
        categories['Frameworks & Libraries'].push(skill);
      } else if (tools.includes(skillLower)) {
        categories['Tools & Technologies'].push(skill);
      } else if (['leadership', 'communication', 'teamwork', 'problem solving', 'project management'].includes(skillLower)) {
        categories['Soft Skills'].push(skill);
      } else {
        categories['Other'].push(skill);
      }
    });

    return Object.entries(categories)
      .filter(([_, skills]) => skills.length > 0)
      .map(([category, skills]) => ({
        name: category,
        value: skills.length,
        skills: skills
      }));
  };

  const data = categorizeSkills(skills);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Code sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">
              Skills Distribution
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            No skills detected in the resume.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Code sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            Skills Distribution
          </Typography>
        </Box>
        
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `${label}: ${data.find(d => d.name === label)?.skills.join(', ')}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SkillsChart; 