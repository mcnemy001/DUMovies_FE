import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { FaSearch, FaTrash } from 'react-icons/fa';
import Modal from '../components/common/ModalConfirm'; 
import { getWatchlist, removeFromWatchlist } from '../utils/api';
import '../assets/styles/Watchlist.css';

const MovieCard = ({ movie, onRemove }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/moviedetail/${movie.movie_id}`);
  };

  return (
    <div 
      className="movie-card" 
      onClick={handleClick} 
      style={{ cursor: 'pointer' }}
    >
      <img 
        src={
          movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : movie.image
        } 
        alt={movie.title} 
        className="movie-image" 
      />
      <button 
        className="remove-from-watchlist" 
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <FaTrash />
      </button>
    </div>
  );
};

const WatchlistHero = ({ searchTerm, onSearchChange }) => {
  return (
    <section className="watchlist-hero">
      <div className="watchlist-hero-content">
        <div className="watchlist-hero-flex-container">
          <div className="watchlist-hero-text">
            <h1 className="watchlist-hero-title">Your Watchlist</h1>
            <p className="watchlist-hero-description">
              Collect your favorite movies here and watch them anytime.
            </p>
          </div>
          <div className="watchlist-search-container">
            <input
              type="text"
              placeholder="Search in your watchlist..."
              className="watchlist-search-input"
              value={searchTerm}
              onChange={onSearchChange}
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
  });
  const [movieToRemove, setMovieToRemove] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found in local storage');
        setLoading(false);
        return;
      }
      try {
        const data = await getWatchlist(userId);
        setWatchlist(data.watchlist);
        setFilteredWatchlist(data.watchlist);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  useEffect(() => {
    const filtered = watchlist.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWatchlist(filtered);
  }, [searchTerm, watchlist]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const confirmRemoveFromWatchlist = (movieId) => {
    setMovieToRemove(movieId);
    setModalState({
      isOpen: true,
      title: 'Remove from Watchlist',
      message: 'Are you sure you want to remove this movie from your watchlist?'
    });
  };

  const handleRemoveFromWatchlist = async () => {
    if (!movieToRemove) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }

    try {
      await removeFromWatchlist(userId, movieToRemove);
      const updatedWatchlist = watchlist.filter((movie) => movie.movie_id !== movieToRemove);
      setWatchlist(updatedWatchlist);
      setModalState({
        isOpen: true,
        title: 'Success',
        message: 'Movie removed from watchlist'
      });
    } catch (err) {
      console.error('Failed to remove movie:', err.message);
      setModalState({
        isOpen: true,
        title: 'Error',
        message: 'Failed to remove movie from watchlist'
      });
    } finally {
      setMovieToRemove(null);
    }
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, title: '', message: '' });
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isEmpty = filteredWatchlist.length === 0;

  return (
    <div className="watchlist-page">
      <Header />
      <WatchlistHero 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange}
      />
      <main className="main-content">
        {isEmpty ? (
          <div className="empty-watchlist">
            <p>
              {searchTerm 
                ? `No movies found matching "${searchTerm}"` 
                : 'Oops! Your watchlist is still empty.'
              }
            </p>
          </div>
        ) : (
          <div className="movies-container">
            <div className="movies-row">
              {filteredWatchlist.map((movie) => (
                <MovieCard
                  key={movie.movie_id}
                  movie={movie}
                  onRemove={() => confirmRemoveFromWatchlist(movie.movie_id)}
                />
              ))}
            </div>
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
        onConfirm={movieToRemove ? handleRemoveFromWatchlist : undefined}
      />
    </div>
  );
};

export default Watchlist;