import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import { updateUserPreferences, getUserPreferences } from '../../utils/api';
import '../../assets/styles/HeroSection.css';
import heroImage from '../../assets/images/hero-3.png';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

const HeroSection = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeMood, setActiveMood] = useState(null);
  const [activeGenres, setActiveGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { updateMood, updateGenres } = useQuiz();

  const toTitleCase = (text) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';

  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const preferences = await getUserPreferences(userId);
          setActiveMood(preferences.mood || null);
          const genres = [preferences.genre1, preferences.genre2].filter(Boolean);
          setActiveGenres(genres);
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    };

    loadUserPreferences();
  }, []);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleMoodClick = async (mood) => {
    const newMood = mood.toLowerCase() === activeMood ? null : mood.toLowerCase();
    setActiveMood(newMood);

    if (activeGenres.length >= 2 && newMood) {
      try {
        const userId = localStorage.getItem('userId');
        await updateUserPreferences({
          user_id: userId,
          mood: newMood,
          genre1: activeGenres[0] || null,
          genre2: activeGenres[1] || null
        });

        updateMood(newMood);
        localStorage.setItem(
          'quizData',
          JSON.stringify({ mood: newMood, genres: activeGenres })
        );

        window.location.reload();
      } catch (error) {
        console.error('Failed to update preferences:', error);
      }
    }
  };

  const handleGenreClick = async (genre) => {
    let newGenres;
    if (activeGenres.includes(genre)) {
      newGenres = activeGenres.filter((g) => g !== genre);
    } else if (activeGenres.length < 2) {
      newGenres = [...activeGenres, genre];
    } else {
      return;
    }

    setActiveGenres(newGenres);

    // Only update and reload if we have both a mood and exactly 2 genres
    if (activeMood && newGenres.length === 2) {
      try {
        const userId = localStorage.getItem('userId');
        await updateUserPreferences({
          user_id: userId,
          mood: activeMood,
          genre1: newGenres[0] || null,
          genre2: newGenres[1] || null
        });

        localStorage.setItem(
          'quizData',
          JSON.stringify({ mood: activeMood, genres: newGenres })
        );

        updateGenres(newGenres);
        window.location.reload();
      } catch (error) {
        console.error('Failed to update preferences:', error);
      }
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      navigate('/search', { state: { query: searchQuery } });
    }
  };

  const moods = ['Happy', 'Sad', 'Relaxed', 'Romantic'];
  const genres = ['Action', 'Horror', 'Science Fiction', 'Thriller', 'Romance', 'Animation', 'Comedy', 'Drama'];

  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className={`hero-title ${showFilters ? 'hidden' : ''}`}>
            Movie Recommendations<br />Tailored Just for You!
          </h1>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search for another movie..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="filter-container">
            <div className="mood-genre-toggle" onClick={toggleFilters}>
              Want to change your mood and genre?
              <FaChevronDown className={`toggle-icon ${showFilters ? 'rotate' : ''}`} />
            </div>

            {showFilters && (
              <div className="mood-genre-filters">
                <div className="mood-section">
                  <div className="filters-title">Mood</div>
                  <div className="mood-options">
                    {moods.map((mood) => (
                      <button
                        key={mood}
                        className={`filter-btn ${activeMood === mood.toLowerCase() ? 'active' : ''}`}
                        onClick={() => handleMoodClick(mood)}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="filter-divider" />

                <div className="genre-section">
                  <div className="filters-title">Genre</div>
                  <div className="genre-options">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        className={`filter-btn ${activeGenres.includes(genre) ? 'active' : ''}`}
                        onClick={() => handleGenreClick(genre)}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;