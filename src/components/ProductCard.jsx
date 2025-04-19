import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Button from './Button';

const ProductCard = ({ name, description, imageUrl, price }) => {
  return (
    <div className="bg-white rounded-default overflow-hidden shadow-lg text-center transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
      <div className="relative w-full h-48"> {/* Container relativo para next/image */}
        <Image
          src={imageUrl || '/images/produto-placeholder.jpg'} // Placeholder default
          alt={name}
          fill // Faz a imagem preencher o container pai
          style={{ objectFit: 'cover' }} // Equivalente a object-fit: cover
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Opcional: ajuda na otimização
        />
      </div>
      {/* Mantém flex-grow aqui para este container ocupar espaço */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-body text-xl font-bold text-primary mb-2">{name}</h3>
        {/* Remove flex-grow daqui */}
        <p className="text-text-main text-sm mb-4">{description}</p> {/* << CLASSE flex-grow REMOVIDA */}
        {price && <p className="font-bold text-lg text-secondary mb-4">R$ {price.toFixed(2)}</p>}
        {/* mt-auto empurra o botão para baixo dentro do espaço do flex-grow pai */}
        <Button variant="primary" className="mt-auto" href="#">
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  price: PropTypes.number,
};

export default ProductCard;