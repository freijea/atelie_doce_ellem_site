import React from 'react';
import PropTypes from 'prop-types';

const ParagraphGroup = ({ paragraphs, className = '' }) => {
  // Verifica se paragraphs é um array e não está vazio
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
    return null; // Não renderiza nada se não houver parágrafos
  }

  return (
    <div className={`font-body text-text-main text-base leading-relaxed ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-4 last:mb-0"> {/* Adiciona margem inferior, exceto no último */}
          {paragraph}
        </p>
      ))}
    </div>
  );
};

ParagraphGroup.propTypes = {
  // Exige um array de strings para os parágrafos
  paragraphs: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string,
};

export default ParagraphGroup;