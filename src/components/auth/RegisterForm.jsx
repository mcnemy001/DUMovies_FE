import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import axios from 'axios';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setModalState({
        isOpen: true,
        title: 'Error',
        message: 'Please fill all fields.',
      });
      return;
    }

    try {
      const response = await axios.post('https://dumovies-production.up.railway.app/register', formData);
      console.log('Registration success:', response.data);

      // Menampilkan modal sukses
      setModalState({
        isOpen: true,
        title: 'Success',
        message: 'Registration successful! Redirecting to sign-in page...',
      });

      // Redirect setelah beberapa detik
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      console.error('Error registering user:', error.response?.data?.message || error.message);

      // Menampilkan modal error
      setModalState({
        isOpen: true,
        title: 'Error',
        message: error.response?.data?.message || 'Error registering user.',
      });
    }
  };

  const handleCloseModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <Input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your full name..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password..."
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>
        <Button type="submit">Sign Up Now</Button>
      </form>

      <Modal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        message={modalState.message}
        duration={1000}
      />
    </>
  );
};

export default RegisterForm;
