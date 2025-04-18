'use client'; // Necessário para hooks e interações do Swiper

import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles in globals.css or directly here if needed
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

const Carousel = ({ children, settings = {}, className = '' }) => {
  const defaultSettings = {
    modules: [Pagination, Navigation, Autoplay],
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: { clickable: true },
    navigation: false,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: { // Default breakpoints, can be overridden by props.settings
      640: { slidesPerView: 1, spaceBetween: 20 },
      768: { slidesPerView: 2, spaceBetween: 30 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
    },
    ...settings, // Override defaults with provided settings
  };

  // Garantir que children seja um array para mapear corretamente
  const slides = React.Children.toArray(children);

  return (
    <Swiper {...defaultSettings} className={`custom-swiper ${className} h-full`}>
      {slides.map((child, index) => (
        // Usar um identificador único se disponível no child, senão o índice
        <SwiperSlide key={child.key || index} className="h-full">
          {/* Adiciona div para garantir altura automática se necessário */}
          <div className="h-full">
             {child}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

Carousel.propTypes = {
  children: PropTypes.node.isRequired,
  settings: PropTypes.object, // Pass Swiper settings object directly
  className: PropTypes.string,
};

export default Carousel;