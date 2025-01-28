import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import Footer from '../components/layout/Footer';
import Modal from '../components/common/Modal';
import {
  getMovieRecommendations,
  getTrendingMovies,
  getUpcomingMovies,
  addToWatchlist,
  getUserPreferences
} from '../utils/api';
import '../assets/styles/Recommendations.css';

// Komponen MovieCard
const MovieCard = ({ movie, showModal }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/moviedetail/${movie.id}`);
  };

  const handleAddToWatchlist = async (e) => {
    e.stopPropagation();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      showModal({
        isOpen: true,
        title: 'Action Failed',
        message: 'User ID not found. Please log in again.',
      });
      return;
    }
    try {
      await addToWatchlist(userId, movie.id);
      showModal({
        isOpen: true,
        title: 'Success',
        message: `${movie.title} has been added to your watchlist!`,
      });
    } catch (err) {
      console.error(err);
      showModal({
        isOpen: true,
        title: 'Action Failed',
        message: 'Failed to add to watchlist. Please try again.',
      });
    }
  };

  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div className="movie-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={imageUrl} alt={movie.title} className="movie-image" />
      <button className="add-to-watchlist" onClick={handleAddToWatchlist}>
        +
      </button>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-rating">Rating: {movie.vote_average.toFixed(1)}</p>
      </div>
    </div>
  );
};

const Recommendations = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
  });
  const navigate = useNavigate();
  const { updateRecommendedMovies, recommendedMovies } = useQuiz();
  const [preferences, setPreferences] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const fetchPreferencesAndMovies = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log('No user ID found');
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching user preferences...');
      
      // Fetch user preferences from database
      const userPreferences = await getUserPreferences(userId);
      console.log('User Preferences:', userPreferences);
      
      setPreferences(userPreferences);

      if (!userPreferences) {
        console.log('No preferences found, navigating to quiz');
        navigate('/quizmood');
        return;
      }

      console.log('Fetching recommendations...');
      // Fetch movies based on preferences
      const [recommendations, trending, upcoming] = await Promise.all([
        getMovieRecommendations(
          userPreferences.mood,
          userPreferences.genre1,
          userPreferences.genre2
        ),
        getTrendingMovies(),
        getUpcomingMovies(),
      ]);

      console.log('Recommendations:', recommendations);
      console.log('Trending:', trending);
      console.log('Upcoming:', upcoming);

      updateRecommendedMovies({
        recommendations: recommendations.movies.results || [],
        trending: trending.results || [],
        upcoming: upcoming.results || [],
      });

      setLoading(false);
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  }, [navigate, updateRecommendedMovies]);

  useEffect(() => {
    // Cek apakah sudah ada data, jika tidak ada maka fetch
    if (
      recommendedMovies.recommendations?.length === 0 && 
      recommendedMovies.trending?.length === 0
    ) {
      fetchPreferencesAndMovies();
    } else {
      setLoading(false);
    }
  }, [fetchPreferencesAndMovies, recommendedMovies, fetchTrigger]);

  const handleCloseModal = () => {
    setModalState({ isOpen: false, title: '', message: '' });
  };

  // Fungsi untuk me-refresh data
  const handleRetry = () => {
    // Trigger ulang fetch dengan mengganti fetchTrigger
    setFetchTrigger(prev => prev + 1);
    setError(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          {/* <p>Loading your personalized recommendations...</p> */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Recommendations</h2>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Try Again
        </button>
        <button onClick={() => navigate('/quizmood')} className="retry-button">
          Take Quiz Again
        </button>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <Header />
      <HeroSection />
      <main className="main-content">
        <div className="movies-container">
          {/* {preferences && (
            <div className="preferences-summary">
              <h2>Your Movie Preferences</h2>
              <p>Mood: {preferences.mood.charAt(0).toUpperCase() + preferences.mood.slice(1)}</p>
              <p>Genres: {preferences.genre1} & {preferences.genre2}</p>
            </div>
          )} */}
  
          <section className="movie-section">
            <h2 className="section-title">Recommended for You</h2>
            <div className="movies-row">
              {recommendedMovies.recommendations?.slice(0, 10).map((movie) => (
                <MovieCard key={movie.id} movie={movie} showModal={setModalState} />
              ))}
            </div>
            <div className="movies-row">
              {recommendedMovies.recommendations?.slice(10, 20).map((movie) => (
                <MovieCard key={movie.id} movie={movie} showModal={setModalState} />
              ))}
            </div>
          </section>
  
          <section className="movie-section">
            <h2 className="section-title">Trending Now</h2>
            <div className="movies-row">
              {recommendedMovies.trending?.slice(0, 10).map((movie) => (
                <MovieCard key={movie.id} movie={movie} showModal={setModalState} />
              ))}
            </div>
            <div className="movies-row">
              {recommendedMovies.trending?.slice(10, 20).map((movie) => (
                <MovieCard key={movie.id} movie={movie} showModal={setModalState} />
              ))}
            </div>
          </section>
  
          <section className="movie-section">
            <h2 className="section-title">Upcoming Movies</h2>
            <div className="movies-row">
              {recommendedMovies.upcoming?.slice(0, 10).map((movie) => (
                <MovieCard key={movie.id} movie={movie} showModal={setModalState} />
              ))}
            </div>
            <div className="movies-row">
              {recommendedMovies.upcoming?.slice(10, 20).map((movie) => (
                <MovieCard key={movie.id} movie={movie} showModal={setModalState} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <Modal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        message={modalState.message}
        duration={2000}
      />
    </div>
  );  
};

export default Recommendations;