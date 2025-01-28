import { Link } from 'react-router-dom';
import logo from '../assets/images/du-movie.svg';
import RegisterForm from '../components/auth/RegisterForm';
import '../assets/styles/SignUp.css';

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-header">
          <h1 className="welcome-text">
            Welcome to <img src={logo} alt="DUMovie" className="logo" />
          </h1>
          <p className="subtitle">
            Don’t have an account yet? Sign up now, it’s free!
          </p>
          <p className="signup-title">Sign Up</p>
        </div>
        
        {/* Register Form */}
        <RegisterForm />

        {/* Sign In Link */}
        <div className="signin-link-container">
          <p className="signin-text">
            Already have an account?{' '}
            <Link to="/signin" className="signin-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;