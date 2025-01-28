import React, { useEffect, useState } from 'react';
import '../../assets/styles/Modal.css';

const Modal = ({ isOpen, onClose, title, message, duration = 3000 }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsActive(true);
      });

      const timer = setTimeout(() => {
        setIsActive(false);

        setTimeout(() => {
          onClose();
        }, 300); 
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isActive ? 'active' : ''}`}>
      <div className="modal-container">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
      </div>
    </div>
  );
};

export default Modal;