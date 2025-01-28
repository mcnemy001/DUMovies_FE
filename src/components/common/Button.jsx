import React from 'react';

const Button = ({ children, type = 'button', onClick }) => {
  return (
    <button type={type} className="custom-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
