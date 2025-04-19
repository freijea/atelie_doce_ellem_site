'use client'; // Por causa do Carousel

import React from 'react';
import Image from 'next/image';
import Carousel from '../components/Carousel';
import Button from '../components/Button';

const bannerSlides = [
  { id: 1, title: "Delícias para sua Páscoa!", description: "Encomende nossos ovos e bolos temáticos.", imageUrl: '/images/banner-1.jpg', alt: 'Promoção Páscoa', ctaText: 'Encomende Já', ctaLink: '#contato' },
  { id: 2, title: "Bolos que Encantam!", description: "Perfeitos para sua festa ou evento especial.", imageUrl: '/images/banner-2.jpg', alt: 'Bolo Decorado', ctaText: 'Veja Opções', ctaLink: '#cardapio' },
  { id: 3, title: "Novidade: Red Velvet!", description: "Experimente nosso delicioso bolo Red Velvet.", imageUrl: '/images/banner-3.jpg', alt: 'Bolo Red Velvet', ctaText: 'Peça o Seu', ctaLink: '#pedido' }, // Adicionar #pedido se existir
];

const BannerSection = () => {
  const carouselSettings = {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    navigation: false, // Pode habilitar se quiser setas no banner
    pagination: { clickable: true },
    breakpoints: {}, // Sem breakpoints extras para banner full width
  };

  return (
    <section id="inicio" className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      <Carousel settings={carouselSettings} key={bannerSlides.length}>
        {bannerSlides.map(slide => (
          <div key={slide.id} className="relative w-full h-full">
            <Image
              src={slide.imageUrl}
              alt={slide.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="100 vw" 
            />
            {/* Overlay e Conteúdo */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
              <div className="text-center text-text-light bg-black bg-opacity-60 p-6 md:p-10 rounded-default max-w-xl mx-auto">
                <h1 className="font-heading text-4xl md:text-5xl mb-4">{slide.title}</h1>
                <p className="font-body text-lg md:text-xl mb-6">{slide.description}</p>
                <Button variant="primary" href={slide.ctaLink}>
                  {slide.ctaText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default BannerSection;