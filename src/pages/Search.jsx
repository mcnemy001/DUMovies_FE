import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMoviesByQuery, addToWatchlist } from '../utils/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Modal from '../components/common/Modal'; 
import { FaSearch } from 'react-icons/fa';
import '../assets/styles/Search.css';

const MovieCard = ({ movie, showModal }) => {
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate(`/moviedetail/${movie.id}`);
    };

    const handleAddToWatchlist = async (e) => {
      e.stopPropagation(); // Prevent navigation to movie detail
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
      </div>
    );
};

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
  });
  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = location.state?.query || '';

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      setError(null);

      getMoviesByQuery(searchQuery)
        .then((data) => {
          setMovies(data.results.slice(0, 20));
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      navigate('/search', { state: { query: e.target.value.trim() } });
    }
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, title: '', message: '' });
  };

  const SearchHero = () => {
      return (
        <section className="watchlist-hero">
          <div className="watchlist-hero-content">
            <div className="watchlist-hero-flex-container">
              <div className="watchlist-hero-text">
                <h1 className="watchlist-hero-title">Search</h1>
              </div>
              <div className="watchlist-search-container">
                <input 
                  type="text" 
                  placeholder="Discover new movies..."
                  className="watchlist-search-input"
                  onKeyDown={handleSearch}
                />
                <FaSearch className="search-icon" />
              </div>
            </div>
          </div>
        </section>
      );
    };

  return (
    <div className="search-page">
      <Header />
      <SearchHero />
      <main className="main-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <p className="error-text">Error: {error}</p>
        ) : movies.length > 0 ? (
          <div className="search-results">
            <h2 className="results-title">Titles related to: {searchQuery}</h2>
            
            <div className="movies-grid">
              {/* First Row */}
              <div className="movies-row">
                {movies.slice(0, 10).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showModal={setModalState}
                  />
                ))}
              </div>
              
              {/* Second Row */}
              <div className="movies-row">
                {movies.slice(10, 20).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showModal={setModalState}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-results">
            <p className="empty-title">Oops! We couldn't find the movie you're looking for.</p>
            <p className="empty-subtitle">Try searching with a different keyword!</p>
          </div>
        )}
      </main>

      <Footer />
      <Modal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        message={modalState.message}
        duration={1000}
      />
    </div>
  );
};

export default Search;