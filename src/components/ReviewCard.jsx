import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Estrelas do react-icons

const ReviewCard = ({ name, stars, review, photoUrl }) => {
  const renderStars = (numStars) => {
    let starElements = [];
    for (let i = 0; i < 5; i++) {
      starElements.push(
        i < numStars ? <FaStar key={i} /> : <FaRegStar key={i} />
      );
    }
    return starElements;
  };

  return (
    <div className="bg-white p-6 rounded-default shadow-lg text-center border border-gray-200 h-full flex flex-col">
       <div className="relative w-20 h-20 mx-auto mb-4 border-4 border-secondary rounded-full overflow-hidden">
            <Image
                src={photoUrl || '/images/avatar-placeholder.png'} // Placeholder
                alt={`Foto de ${name}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="80px"
            />
       </div>
      <h3 className="font-body font-bold text-lg text-secondary mb-1">{name}</h3>
      <div className="text-primary text-xl mb-2 flex justify-center space-x-1">
          {renderStars(stars)}
      </div>
      <p className="text-text-main text-sm italic flex-grow">"{review}"</p>
    </div>
  );
};

ReviewCard.propTypes = {
  name: PropTypes.string.isRequired,
  stars: PropTypes.number.isRequired,
  review: PropTypes.string.isRequired,
  photoUrl: PropTypes.string,
};

export default ReviewCard;