import React from 'react';
import PropTypes from 'prop-types';

const SectionTitle = ({ children, className = '' }) => {
  return (
    // Usando a variável de fonte definida no layout.jsx
    <h2 className={`font-heading text-3xl md:text-4xl text-center mb-10 md:mb-12 text-secondary ${className}`}>
      {children}
    </h2>
  );
};

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default SectionTitle;