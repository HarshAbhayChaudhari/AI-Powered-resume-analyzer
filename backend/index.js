const functions = require('@google-cloud/functions-framework');
const multer = require('multer');
const cors = require('cors')({ origin: true });
const pdfParse = require('pdf-parse');
const admin = require('firebase-admin');
const OpenAI = require('openai');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id'
  });
}

const db = admin.firestore();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

functions.http('analyzeResume', (req, res) => {
  cors(req, res, async () => {
    try {
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
      }

      // Only allow POST requests
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
      }

      // Process file upload
      upload.single('resume')(req, res, async (err) => {
        if (err) {
          console.error('Upload error:', err);
          res.status(400).json({ error: err.message });
          return;
        }

        if (!req.file) {
          res.status(400).json({ error: 'No file uploaded' });
          return;
        }

        try {
          // Extract text from PDF
          const pdfBuffer = req.file.buffer;
          const pdfData = await pdfParse(pdfBuffer);
          const extractedText = pdfData.text;

          // Perform AI analysis
          const analysisResult = await performAIAnalysis(extractedText, req.file.originalname);

          // Store result in Firestore (optional)
          await storeAnalysisResult(analysisResult);

          res.status(200).json(analysisResult);
        } catch (error) {
          console.error('Analysis error:', error);
          res.status(500).json({ error: 'Failed to analyze resume' });
        }
      });
    } catch (error) {
      console.error('Function error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

async function performAIAnalysis(text, fileName) {
  try {
    // Extract skills using NLP
    const skills = await extractSkillsWithAI(text);
    
    // Calculate scores
    const scores = calculateScores(text, skills);
    
    // Generate recommendations using AI
    const recommendations = await generateAIRecommendations(text, skills, scores);
    
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
      extractedText: text,
      fileName: fileName,
      analysisDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    throw error;
  }
}

async function extractSkillsWithAI(text) {
  try {
    const prompt = `
    Extract technical skills and keywords from this resume text. 
    Return only a JSON array of skill names, no explanations.
    
    Resume text: ${text.substring(0, 2000)}
    
    Focus on:
    - Programming languages
    - Frameworks and libraries
    - Tools and technologies
    - Soft skills
    - Industry-specific terms
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a resume parser that extracts skills and keywords. Return only valid JSON arrays."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    const skills = JSON.parse(response);
    
    return Array.isArray(skills) ? skills : [];
  } catch (error) {
    console.error('AI skills extraction error:', error);
    // Fallback to keyword matching
    return extractSkillsFallback(text);
  }
}

function extractSkillsFallback(text) {
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

  return foundSkills.slice(0, 10);
}

function calculateScores(text, skills) {
  const textLength = text.length;
  const skillsCount = skills.length;
  
  // Skills score
  const skillsScore = Math.min(100, Math.max(20, skillsCount * 10));
  
  // Experience score
  const experienceKeywords = ['experience', 'worked', 'developed', 'managed', 'led', 'created', 'implemented', 'achieved', 'increased', 'reduced'];
  const experienceMatches = experienceKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).length;
  const experienceScore = Math.min(100, Math.max(30, experienceMatches * 12 + 30));
  
  // Education score
  const educationKeywords = ['university', 'college', 'degree', 'bachelor', 'master', 'phd', 'education', 'graduated', 'gpa'];
  const educationMatches = educationKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).length;
  const educationScore = Math.min(100, Math.max(40, educationMatches * 15 + 40));
  
  // Format score
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
}

async function generateAIRecommendations(text, skills, scores) {
  try {
    const prompt = `
    Analyze this resume and provide specific, actionable recommendations for improvement.
    Focus on ATS compatibility, skills, experience descriptions, and formatting.
    
    Resume text: ${text.substring(0, 1500)}
    Current skills: ${skills.join(', ')}
    Scores: Skills ${scores.skills}/100, Experience ${scores.experience}/100, Education ${scores.education}/100, Format ${scores.format}/100
    
    Provide 5-8 specific recommendations. Return as JSON array of strings.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a resume optimization expert. Provide specific, actionable recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 800
    });

    const response = completion.choices[0].message.content;
    const recommendations = JSON.parse(response);
    
    return Array.isArray(recommendations) ? recommendations : generateFallbackRecommendations(text, skills, scores);
  } catch (error) {
    console.error('AI recommendations error:', error);
    return generateFallbackRecommendations(text, skills, scores);
  }
}

function generateFallbackRecommendations(text, skills, scores) {
  const recommendations = [];
  
  if (skills.length < 5) {
    recommendations.push('Add more technical skills to improve ATS compatibility');
  }
  
  if (scores.experience < 70) {
    recommendations.push('Use more action-oriented verbs in your experience descriptions');
    recommendations.push('Quantify your achievements with specific metrics');
  }
  
  if (scores.education < 60) {
    recommendations.push('Ensure your education section is clearly formatted');
  }
  
  if (scores.format < 80) {
    recommendations.push('Consider using bullet points for better readability');
  }
  
  recommendations.push('Include relevant keywords from job descriptions');
  recommendations.push('Add a professional summary at the top');
  recommendations.push('Keep your resume to 1-2 pages maximum');
  
  return recommendations.slice(0, 8);
}

async function storeAnalysisResult(result) {
  try {
    const analysisRef = db.collection('resume_analyses');
    await analysisRef.add({
      ...result,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Firestore storage error:', error);
    // Don't fail the request if storage fails
  }
} 