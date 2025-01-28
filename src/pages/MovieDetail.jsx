import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { FaStar } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getSimilarMovies } from '../utils/api'; // Pastikan fungsi getSimilarMovies ada di api.js
import '../assets/styles/MovieDetail.css';

const MovieCard = ({ image, title }) => {
  return (
    <div className="similar-movie-card">
      <img src={image} alt={title} className="similar-movie-image" />
      <button className="add-to-watchlist">+</button>
    </div>
  );
};

const MovieDetail = () => {
  const { id } = useParams(); // Get movie ID from URL
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]); // State untuk similar movies
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await getMovieDetails(id);
        setMovie({
          ...response.details,
          director: response.director, // Menambahkan director ke movie state
          cast: response.credits.cast.slice(0, 5), // Ambil 5 pemeran utama
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
        setSimilarMovies(response.similar); // Set similar movies ke state
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMovieDetails();
    fetchSimilarMovies(); // Panggil API untuk similar movies
  }, [id]);

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
    : '/src/assets/images/default-backdrop.jpg'; // Provide a default image if backdropUrl is not available

  const releaseYear = new Date(movie.release_date).getFullYear();

  return (
    <div className="movie-detail-page">
      <Header />
      
      {/* Hero Section */}
      <section className="detail-movie-hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="detail-hero-overlay">
          <div className="detail-hero-content">
            <h1 className="detail-movie-title">{movie.title}</h1>
            <p className="detail-release-year">{releaseYear}</p>
          </div>
        </div>
      </section>

      {/* Detail Container */}
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

      {/* Similar Movies Section */}
      <section className="similar-movies">
        <h2>Similar Movies</h2>
        <div className="similar-movies-grid">
          {similarMovies.map((similarMovie) => (
            <MovieCard key={similarMovie.id} image={similarMovie.posterUrl} title={similarMovie.title} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MovieDetail;
