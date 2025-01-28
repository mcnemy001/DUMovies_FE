import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import axios from 'axios';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleCloseModal = () => {
    setModalState({ isOpen: false, title: '', message: '' });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://dumovies-production.up.railway.app/login', formData);
      console.log('Login success:', response.data);

      // Simpan token dan username di localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('userId', response.data.user.user_id);

      // Tampilkan modal sukses
      setModalState({
        isOpen: true,
        title: 'Login Successful',
        message: 'You have successfully logged in. Redirecting...',
      });

      // Tunggu sebentar sebelum memeriksa preferences
      setTimeout(async () => {
        try {
          // Gunakan try-catch untuk menangani 404 atau error lainnya
          const preferencesResponse = await axios.get(
            `https://dumovies-production.up.railway.app/api/preferences/${response.data.user.user_id}`
          );
          
          // Jika preferences ada
          if (preferencesResponse.data) {
            navigate('/recommendations');
          } else {
            navigate('/quizmood');
          }
        } catch (preferencesError) {
          // Jika error 404 atau error lain, arahkan ke quiz
          console.error('Error checking preferences:', preferencesError);
          navigate('/quizmood');
        }
      }, 1000);

    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
      setModalState({
        isOpen: true,
        title: 'Login Failed',
        message: error.response?.data?.message || 'Unable to log in. Please try again.',
      });
    }
  };

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="emailOrUsername">Email or Username</label>
          <Input
            type="text"
            id="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
            placeholder="Enter your email or username..."
          />
        </div>
        <div className="form-group">
          <div className="password-header">
            <label htmlFor="password">Password</label>
            <a href="/forgotpassword" className="forgot-password">
              Forgot Password?
            </a>
          </div>
          <div className="password-input-wrapper">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Type your password..."
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "👁" : "🙈"}
            </button>
          </div>
        </div>
        <Button type="submit">Log In</Button>
      </form>

      {/* Modal Component */}
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

export default LoginForm;
