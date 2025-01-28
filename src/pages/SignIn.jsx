import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';
import logo from '../assets/images/du-movie.svg';
import '../assets/styles/SignIn.css';

const SignIn = () => {
  return (
    <div className="signin-container">
      <div className="signin-content">
        <div className="signin-header">
          <h1 className="welcome-text">
            Welcome to <img src={logo} alt="DUMovie" className="logo" />
          </h1>
          <p className="subtitle">
            Sign in to get exciting movie recommendations tailored to your mood!
          </p>
          <p className="signin-title">Sign In</p>
        </div>
        <LoginForm />
        <div className="signup-link-container">
          <p className="signup-text">
            Dont have an account?{' '}
            <Link to="/signup" className="signup-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;