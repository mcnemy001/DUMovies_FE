import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

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
          <Button 
            onClick={() => navigate('/')}
            style={{
              maxWidth: '200px',
              margin: '0 auto'
            }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;