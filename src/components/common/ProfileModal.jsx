import React from 'react';
import '../../assets/styles/ProfileModal.css';
import { FaSignOutAlt } from 'react-icons/fa';

const ProfileModal = ({ isOpen, username, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="profile-modal-container">
      <div className="profile-modal">
        <p className="profile-username">{username}</p>
        <button className="logout-btn" onClick={onLogout}>
          Logout <FaSignOutAlt className="logout-icon" />
        </button>
        <button className="close-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
