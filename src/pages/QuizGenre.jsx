import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import '../assets/styles/QuizGenre.css';
import actionIcon from '../assets/images/action.svg';
import comedyIcon from '../assets/images/comedy.svg';
import dramaIcon from '../assets/images/drama.svg';
import horrorIcon from '../assets/images/horror.svg';
import thrillerIcon from '../assets/images/thriller.svg';
import scifiIcon from '../assets/images/scifi.svg';
import romanceIcon from '../assets/images/romance.svg';
import animationIcon from '../assets/images/animation.svg';

const QuizGenre = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();
  const { updateGenres } = useQuiz();

  const genres = [
    { id: 'Action', label: 'Action', icon: actionIcon },
    { id: 'Comedy', label: 'Comedy', icon: comedyIcon },
    { id: 'Drama', label: 'Drama', icon: dramaIcon },
    { id: 'Horror', label: 'Horror', icon: horrorIcon },
    { id: 'Thriller', label: 'Thriller', icon: thrillerIcon },
    { id: 'Science Fiction', label: 'Science Fiction', icon: scifiIcon },
    { id: 'Romance', label: 'Romance', icon: romanceIcon },
    { id: 'Animation', label: 'Animation', icon: animationIcon },
  ];

  const handleGenreSelect = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else if (selectedGenres.length < 2) {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleNext = () => {
    if (selectedGenres.length > 0) {
      updateGenres(selectedGenres);
      navigate('/quizresult');
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <h1 className="quiz-title">Now Choose Your Favorite Genres!</h1>
        <p className="quiz-subtitle">
          Select up to 3 genres you enjoy. We'll find the perfect movie for you!
        </p>

        <p className="selected-genres-count">
          {selectedGenres.length} / 2 genres selected
        </p>

        <div className="genre-grid">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`genre-card ${selectedGenres.includes(genre.id) ? 'selected' : ''}`}
              onClick={() => handleGenreSelect(genre.id)}
            >
              <img src={genre.icon} alt={genre.label} className="genre-icon" />
              <span className="genre-label">{genre.label}</span>
            </button>
          ))}
        </div>

        <button 
          className={`next-button ${selectedGenres.length === 0 ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={selectedGenres.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizGenre;