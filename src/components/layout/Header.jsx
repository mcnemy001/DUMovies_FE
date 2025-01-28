import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/Header.css';
import { FaUserCircle } from 'react-icons/fa';
import LogoDUMovie from '../../assets/images/du-movie.svg';
import ProfileModal from '../common/ProfileModal';

const Header = ({ type = 'recommendation' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState('User');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername); // Ambil username dari localStorage
    }    
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileModal = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    // Hapus data token/session di sini
    localStorage.removeItem('token'); // Hapus token
    localStorage.removeItem('username'); // Hapus username
    navigate('/signin');
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <Link to="/recommendations" className="logo-link">
            <img src={LogoDUMovie} alt="DUMovie Logo" className="logo" />
          </Link>
        </div>
        {type === 'startup' ? (
          <>
            <button className="hamburger-btn" onClick={toggleMenu}>
              ☰
            </button>
            <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
              <button className="close-btn" onClick={toggleMenu}>
                ✖
              </button>
              <Link to="/signin" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/signup" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </nav>
          </>
        ) : (
          <>
            <button className="hamburger-btn" onClick={toggleMenu}>
              ☰
            </button>
            <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
              <button className="close-btn" onClick={toggleMenu}>
                ✖
              </button>
              <Link to="/recommendations" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/watchlist" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Watchlist
              </Link>
              <div className="header-right">
                <button className="profile-icon-btn" onClick={toggleProfileModal}>
                  <FaUserCircle className="profile-icon" />
                </button>
                <ProfileModal
                  isOpen={isProfileOpen}
                  username={username} 
                  onClose={toggleProfileModal}
                  onLogout={handleLogout}
                />
              </div>
            </nav>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
