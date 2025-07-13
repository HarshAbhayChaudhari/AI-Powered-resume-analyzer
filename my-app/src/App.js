import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import Header from './components/Header';
import ResumeUpload from './components/ResumeUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import { AnalysisProvider } from './context/AnalysisContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnalysisProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Routes>
                <Route path="/" element={<ResumeUpload />} />
                <Route path="/dashboard" element={<AnalysisDashboard />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </AnalysisProvider>
    </ThemeProvider>
  );
}

export default App;
