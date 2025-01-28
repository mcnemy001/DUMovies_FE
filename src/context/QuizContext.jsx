// src/context/QuizContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create the context
const QuizContext = createContext(null);

// Create the provider component
export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState({
    mood: null,
    genres: []
  });

  const [recommendedMovies, setRecommendedMovies] = useState({
    recommendations: [],
    trending: [],
    upcoming: []
  });

  const updateMood = (mood) => {
    setQuizData(prev => ({ ...prev, mood }));
  };

  const updateGenres = (genres) => {
    setQuizData(prev => ({ ...prev, genres }));
  };

  const updateRecommendedMovies = (movies) => {
    setRecommendedMovies(movies);
  };

  return (
    <QuizContext.Provider 
      value={{ 
        quizData, 
        updateMood, 
        updateGenres, 
        recommendedMovies, 
        updateRecommendedMovies 
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

// Create the hook for using the context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};