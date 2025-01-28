import React, { useEffect, useState } from 'react';
import '../../assets/styles/Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  duration = 3000,
  onConfirm 
}) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsActive(true);
      });

      // Jika tidak ada konfirmasi, gunakan timer auto close
      const timer = onConfirm ? null : setTimeout(() => {
        setIsActive(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => timer && clearTimeout(timer);
    }
  }, [isOpen, onClose, duration, onConfirm]);

  const handleConfirm = () => {
    onConfirm && onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isActive ? 'active' : ''}`}>
      <div className="modal-container">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          {onConfirm ? (
            <>
              <button onClick={handleConfirm} className="modal-btn confirm">
                Confirm
              </button>
              <button onClick={onClose} className="modal-btn cancel">
                Cancel
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Modal;