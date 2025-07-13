import React, { createContext, useContext, useReducer } from 'react';

const AnalysisContext = createContext();

const initialState = {
  analysisResult: null,
  isLoading: false,
  error: null,
  uploadHistory: [],
};

const analysisReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ANALYSIS_RESULT':
      return { 
        ...state, 
        analysisResult: action.payload,
        isLoading: false,
        error: null 
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload,
        isLoading: false 
      };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        uploadHistory: [action.payload, ...state.uploadHistory]
      };
    case 'CLEAR_ANALYSIS':
      return {
        ...state,
        analysisResult: null,
        error: null
      };
    default:
      return state;
  }
};

export const AnalysisProvider = ({ children }) => {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setAnalysisResult = (result) => {
    dispatch({ type: 'SET_ANALYSIS_RESULT', payload: result });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const addToHistory = (analysis) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: analysis });
  };

  const clearAnalysis = () => {
    dispatch({ type: 'CLEAR_ANALYSIS' });
  };

  const value = {
    ...state,
    setLoading,
    setAnalysisResult,
    setError,
    addToHistory,
    clearAnalysis,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}; 