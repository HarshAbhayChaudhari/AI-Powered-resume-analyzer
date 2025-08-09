import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Mock API endpoint - in production, this would be your Google Cloud Function URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const analyzeResume = async (file) => {
  try {
    // Extract text from PDF
    const extractedText = await extractTextFromPDF(file);
    
    // For demo purposes, we'll use a mock analysis
    // In production, this would call your Google Cloud Function
    const analysisResult = await performMockAnalysis(extractedText, file.name);
    
    return analysisResult;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze resume. Please try again.');
  }
};

const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + ' ';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is not corrupted.');
  }
};

const performMockAnalysis = async (extractedText, fileName) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract skills using keyword matching
  const skills = extractSkills(extractedText);
  
  // Calculate scores based on content analysis
  const scores = calculateScores(extractedText, skills);
  
  // Generate recommendations
  const recommendations = generateRecommendations(extractedText, skills, scores);

  return {
    overallScore: scores.overall,
    sectionScores: {
      skills: scores.skills,
      experience: scores.experience,
      education: scores.education,
      format: scores.format
    },
    skills: skills,
    recommendations: recommendations,
    extractedText: extractedText,
    fileName: fileName,
    analysisDate: new Date().toISOString()
  };
};

const extractSkills = (text) => {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'Jira',
    'PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'SQLite', 'TypeScript', 'HTML',
    'CSS', 'SASS', 'LESS', 'Bootstrap', 'jQuery', 'Laravel', 'ASP.NET',
    'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Project Management'
  ];

  const foundSkills = [];
  const textLower = text.toLowerCase();

  commonSkills.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  // Add some random skills for demo purposes
  const demoSkills = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'];
  demoSkills.forEach(skill => {
    if (!foundSkills.includes(skill)) {
      foundSkills.push(skill);
    }
  });

  return foundSkills.slice(0, 8); // Limit to 8 skills for demo
};

const calculateScores = (text, skills) => {
  const textLength = text.length;
  const skillsCount = skills.length;
  
  // Skills score based on number of skills found
  const skillsScore = Math.min(100, Math.max(20, skillsCount * 12));
  
  // Experience score based on keywords and text length
  const experienceKeywords = ['experience', 'worked', 'developed', 'managed', 'led', 'created', 'implemented'];
  const experienceMatches = experienceKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).length;
  const experienceScore = Math.min(100, Math.max(30, experienceMatches * 15 + 30));
  
  // Education score
  const educationKeywords = ['university', 'college', 'degree', 'bachelor', 'master', 'phd', 'education'];
  const educationMatches = educationKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).length;
  const educationScore = Math.min(100, Math.max(40, educationMatches * 20 + 40));
  
  // Format score based on text structure
  const formatScore = Math.min(100, Math.max(50, textLength > 1000 ? 85 : 60));
  
  // Overall score
  const overallScore = Math.round((skillsScore + experienceScore + educationScore + formatScore) / 4);
  
  return {
    overall: overallScore,
    skills: skillsScore,
    experience: experienceScore,
    education: educationScore,
    format: formatScore
  };
};

const generateRecommendations = (text, skills, scores) => {
  const recommendations = [];
  
  // Skills recommendations
  if (skills.length < 5) {
    recommendations.push('Add more technical skills to improve ATS compatibility');
  }
  if (!skills.some(skill => skill.toLowerCase().includes('react'))) {
    recommendations.push('Consider adding React to your skills section');
  }
  if (!skills.some(skill => skill.toLowerCase().includes('typescript'))) {
    recommendations.push('Include TypeScript in your skills for better job prospects');
  }
  
  // Experience recommendations
  if (scores.experience < 70) {
    recommendations.push('Use more action-oriented verbs in your experience descriptions');
    recommendations.push('Quantify your achievements with specific metrics');
  }
  
  // Education recommendations
  if (scores.education < 60) {
    recommendations.push('Ensure your education section is clearly formatted');
  }
  
  // Format recommendations
  if (scores.format < 80) {
    recommendations.push('Consider using bullet points for better readability');
    recommendations.push('Ensure consistent formatting throughout the document');
  }
  
  // General recommendations
  recommendations.push('Include relevant keywords from job descriptions');
  recommendations.push('Add a professional summary at the top');
  recommendations.push('Keep your resume to 1-2 pages maximum');
  
  return recommendations.slice(0, 8); // Limit to 8 recommendations
};

// Real API call function (for production)
export const analyzeResumeWithAPI = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds timeout
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to analyze resume');
  }
}; 