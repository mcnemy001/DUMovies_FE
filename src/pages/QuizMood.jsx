import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import '../assets/styles/QuizMood.css';
import happyEmoji from '../assets/images/happy.svg';
import sadEmoji from '../assets/images/sad.svg';
import relaxedEmoji from '../assets/images/relaxed.svg';
import romanticEmoji from '../assets/images/romantic.svg';


const QuizMood = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();
  const { updateMood } = useQuiz(); 

  const moods = [
    { id: 'happy', label: 'Happy', icon: happyEmoji },
    { id: 'sad', label: 'Sad', icon: sadEmoji },
    { id: 'relaxed', label: 'Relaxed', icon: relaxedEmoji },
    { id: 'romantic', label: 'Romantic', icon: romanticEmoji },
  ];

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
  };

  const handleNext = () => {
    if (selectedMood) {
      updateMood(selectedMood); // Save mood to context
      navigate('/quizgenre'); // Navigate to QuizGenre
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <h1 className="quiz-title">Discover Your Mood Today!</h1>
        <p className="quiz-subtitle">
          Choose the mood that best describes how you feel, and we'll recommend the perfect movies for you!
        </p>

        {/* Selected Mood Display */}
        {selectedMood && (
          <div className="selected-mood">
            <img 
              src={moods.find(mood => mood.id === selectedMood).icon} 
              alt={selectedMood} 
              className="selected-mood-icon"
            />
            <h2 className="selected-mood-title">
              {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
            </h2>
            <p className="selected-mood-description">
              {selectedMood === 'happy' && "Feeling on top of the world? We've got movies to make your day even brighter!"}
              {selectedMood === 'sad' && "Need some comfort? We've got the perfect movies to lift your spirits!"}
              {selectedMood === 'relaxed' && "Looking for something chill? We've got the perfect laid-back movies for you!"}
              {selectedMood === 'romantic' && "In the mood for love? We've got the most romantic movies picked just for you!"}
            </p>
          </div>
        )}

        {/* Mood Selection Grid */}
        <div className="mood-grid">
          {moods.map((mood) => (
            <button
              key={mood.id}
              className={`mood-card ${selectedMood === mood.id ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(mood.id)}
            >
              <img src={mood.icon} alt={mood.label} className="mood-icon" />
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>

        <button 
          className={`next-button ${!selectedMood ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!selectedMood}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizMood;