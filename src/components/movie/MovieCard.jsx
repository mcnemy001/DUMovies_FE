import '../../assets/styles/MovieCard.css';

const MovieCard = ({ image, title, onClick }) => {
  return (
    <div className="movie-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <img src={image} alt={title} className="movie-image" />
      <button className="add-to-watchlist">
        <span className="plus-icon">+</span>
      </button>
    </div>
  );
};

export default MovieCard;
