import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { FaStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getSimilarMovies, addToWatchlist } from '../utils/api';
import Modal from '../components/common/Modal';
import '../assets/styles/MovieDetail.css';

const MovieCard = ({ movie, showModal }) => {
  const navigate = useNavigate();
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

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

  return (
    <div className="similar-movie-card" onClick={handleClick}>
      <img src={imageUrl} alt={movie.title} className="similar-movie-image" />
      <button className="add-to-watchlist" onClick={handleAddToWatchlist}>
        +
      </button>
    </div>
  );
};

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await getMovieDetails(id);
        setMovie({
          ...response.details,
          director: response.director,
          cast: response.credits.cast.slice(0, 5),
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchSimilarMovies = async () => {
      try {
        const response = await getSimilarMovies(id);
        setSimilarMovies(response.similar);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMovieDetails();
    fetchSimilarMovies();
  }, [id]);

  const handleCloseModal = () => {
    setModalState({ isOpen: false, title: '', message: '' });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  const backdropUrl = movie.backdropUrl
    ? `https://image.tmdb.org/t/p/original${movie.backdropUrl}`
    : '/src/assets/images/default-backdrop.jpg';

  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <div className="movie-detail-page">
      <Header />
      
      <section className="detail-movie-hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="detail-hero-overlay">
          <div className="detail-hero-content">
            <h1 className="detail-movie-title">{movie.title}</h1>
            <p className="detail-release-year">{releaseYear}</p>
          </div>
        </div>
      </section>

      <main className="detail-container">
        <div className="detail-content">
          <section className="synopsis-section">
            <h2>Synopsis</h2>
            <p>{movie.overview}</p>
            <div className="movie-meta">
              <span className="rating">
                <FaStar className="star-icon" /> {movie.vote_average}
              </span>
              <span className="duration">{movie.runtime} min</span>
              <span className="country">{movie.origin_country.join(', ')}</span>
              <span className="genre">{movie.genre_names.join(', ')}</span>
            </div>
          </section>

          <section className="credits-section">
            <div className="director-info">
              <h2>Director:</h2>
              <p>{movie.director || 'Unknown'}</p>
            </div>
            <div className="stars-info">
              <h2>Stars:</h2>
              <p>
                {movie.cast
                  ? movie.cast.map((cast) => cast.name).join(', ')
                  : 'No cast information available'}
              </p>
            </div>
          </section>
        </div>
      </main>

      <section className="similar-movies">
        <h2>Similar Movies</h2>
        <div className="similar-movies-grid">
          {similarMovies.map((similarMovie) => (
            <MovieCard
              key={similarMovie.id}
              movie={similarMovie}
              showModal={setModalState}
            />
          ))}
        </div>
      </section>

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

export default MovieDetail;
