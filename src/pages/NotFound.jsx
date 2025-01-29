import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="signin-container">
      <div className="signin-content">
        <div className="signin-header">
          <h1 className="welcome-text">
            404
          </h1>
          <p className="subtitle">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
