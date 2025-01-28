import React from 'react';

const Button = ({ children, type = 'button' }) => {
  return (
    <button type={type} className="custom-button">
      {children}
    </button>
  );
};

export default Button;