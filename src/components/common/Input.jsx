import React from 'react';

const Input = ({ type, id, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required
      className="custom-input"
      placeholder={placeholder}
    />
  );
};

export default Input;
