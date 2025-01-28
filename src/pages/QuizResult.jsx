import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import { savePreferences } from '../utils/api';
import '../assets/styles/QuizResult.css';

// Import icons (sudah ada di kode Anda)
import happyEmoji from '../assets/images/happy.svg';
import sadEmoji from '../assets/images/sad.svg';
import relaxedEmoji from '../assets/images/relaxed.svg';
import romanticEmoji from '../assets/images/romantic.svg';

// Import genre icons (sudah ada di kode Anda)
import actionIcon from '../assets/images/action.svg';
import comedyIcon from '../assets/images/comedy.svg';
import dramaIcon from '../assets/images/drama.svg';
import horrorIcon from '../assets/images/horror.svg';
import thrillerIcon from '../assets/images/thriller.svg';
import scifiIcon from '../assets/images/scifi.svg';
import romanceIcon from '../assets/images/romance.svg';
import animationIcon from '../assets/images/animation.svg';

const QuizResult = () => {
  const { quizData } = useQuiz();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  // State untuk mengelola error
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const moodIcons = {
    happy: happyEmoji,
    sad: sadEmoji,
    relaxed: relaxedEmoji,
    romantic: romanticEmoji,
  };

  const genreIcons = {
    'Action': actionIcon,
    'Comedy': comedyIcon,
    'Drama': dramaIcon,
    'Horror': horrorIcon,
    'Thriller': thrillerIcon,
    'Science Fiction': scifiIcon,
    'Romance': romanceIcon,
    'Animation': animationIcon,
  };

  const moodDescriptions = {
    happy: "Feeling on top of the world? We've got movies to make your day even brighter!",
    sad: "Need some comfort? We've got the perfect movies to lift your spirits!",
    relaxed: "Looking for something chill? We've got the perfect laid-back movies for you!",
    romantic: "In the mood for love? We've got the most romantic movies picked just for you!",
  };

  const handleRecommendations = async () => {
    // Validasi data sebelum menyimpan
    if (!userId) {
      setError('User ID not found. Please log in again.');
      return;
    }

    if (!quizData.mood || quizData.genres.length < 2) {
      setError('Please complete the quiz before proceeding.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
  
      console.log('Saving preferences:', {
        user_id: userId,
        mood: quizData.mood,
        genre1: quizData.genres[0],
        genre2: quizData.genres[1]
      });
  
      // Simpan preferensi ke database
      const saveResult = await savePreferences({
        user_id: userId,
        mood: quizData.mood,
        genre1: quizData.genres[0],
        genre2: quizData.genres[1]
      });
  
      console.log('Save preferences result:', saveResult);
  
      // Navigate ke halaman rekomendasi
      navigate('/recommendations', { 
        state: { 
          mood: quizData.mood.charAt(0).toUpperCase() + quizData.mood.slice(1),
          genre1: quizData.genres[0],
          genre2: quizData.genres[1]
        } 
      });
    } catch (error) {
      console.error('Detailed save preferences error:', error);
      setError(error.message || 'Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="result-quiz-container">
      {/* Error handling */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <h2 className="confirmation-message">Got it! Your mood and genre are saved.</h2>

      <div className="result-section">
        {quizData.mood ? (
          <div className="selected-mood">
            <img
              src={moodIcons[quizData.mood]}
              alt={quizData.mood}
              className="selected-mood-icon"
            />
            <h2 className="selected-mood-title">
              {quizData.mood.charAt(0).toUpperCase() + quizData.mood.slice(1)}
            </h2>
            <p className="selected-mood-description">
              {moodDescriptions[quizData.mood]}
            </p>
          </div>
        ) : (
          <p className="no-data">No mood selected.</p>
        )}
      </div>

      <div className="just-line"><hr /></div>

      <div className="result-section">
        {quizData.genres.length > 0 ? (
          <div className="result-items">
            {quizData.genres.map((genre) => (
              <div className="result-item" key={genre}>
                <img
                  src={genreIcons[genre]}
                  alt={genre}
                  className="result-icon"
                />
                <span className="result-label">{genre}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No genres selected.</p>
        )}
        <p className="genre-message">
          Your genre selection is awesome! We'll find the best combination for you.
        </p>
      </div>

      <button 
        className="recommendations-button" 
        onClick={handleRecommendations}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Find the Perfect Movie for You!'}
      </button>
    </div>
  );
};

export default QuizResult;