import React from 'react';
import PropTypes from 'prop-types';

// Mapeamento de tamanhos para classes Tailwind
const sizeClasses = {
  default: 'text-3xl md:text-4xl', // Tamanho padrão atual
  large: 'text-4xl md:text-5xl',   // Exemplo de tamanho maior
  medium: 'text-2xl md:text-3xl', // Exemplo de tamanho médio
  small: 'text-xl md:text-2xl',   // Exemplo de tamanho menor
};

const SectionTitle = ({ children, className = '', as = 'h2', size = 'default' }) => {
  const Tag = as; // Define a tag HTML dinamicamente
  const currentSizeClasses = sizeClasses[size] || sizeClasses.default; // Pega a classe de tamanho ou usa o padrão

  return (
    // Usa a tag dinâmica e as classes de tamanho corretas
    // Removido text-center padrão, controle isso onde o componente é usado
    <Tag className={`font-heading mb-10 md:mb-12 text-secondary ${currentSizeClasses} ${className}`}>
      {children}
    </Tag>
  );
};

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']), // Tags HTML permitidas
  size: PropTypes.oneOf(['default', 'large', 'medium', 'small']), // Tamanhos permitidos
};

export default SectionTitle;