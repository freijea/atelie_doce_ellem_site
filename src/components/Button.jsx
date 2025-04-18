import React from 'react';
import PropTypes from 'prop-types';

// Sem necessidade de 'use client' pois é apenas visual
const Button = ({ children, variant = 'primary', onClick, type = 'button', className = '', href }) => {
  const baseStyle = 'inline-block px-6 py-3 rounded-default font-body font-bold text-center cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-0.5';

  const variants = {
    primary: 'bg-primary text-text-light hover:bg-pink-700', // Use a cor exata se preferir
    secondary: 'bg-secondary text-text-light hover:bg-green-700', // Use a cor exata se preferir
  };

  // Se href for passado, renderiza como link, senão como botão
  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyle} ${variants[variant]} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string, // Adicionado para links
};

export default Button;