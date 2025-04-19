import React from 'react';
import PropTypes from 'prop-types';

const SectionTitle = ({ children, className = '' }) => {
  return (
    // Removido text-center daqui
    <h2 className={`font-heading text-3xl md:text-4xl mb-10 md:mb-12 text-secondary ${className}`}>
      {children}
    </h2>
  );
};

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default SectionTitle;