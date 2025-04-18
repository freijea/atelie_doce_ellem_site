'use client'; // Por causa do Carousel

import React from 'react';
import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import ReviewCard from '../components/ReviewCard';
import Carousel from '../components/Carousel';

// Mock Data
const reviews = [
  { id: 1, name: "Maria S.", stars: 5, review: "O bolo era simplesmente divino! Super recomendo o Ateliê Doce Ellen.", photoUrl: '/images/cliente-1.jpg' },
  { id: 2, name: "João P.", stars: 5, review: "Docinhos maravilhosos e entrega pontual. Virei cliente!", photoUrl: '/images/cliente-2.jpg' },
  { id: 3, name: "Ana C.", stars: 4, review: "Gostei muito do sabor, só achei um pouco pequeno pelo preço.", photoUrl: null },
  { id: 4, name: "Carlos M.", stars: 5, review: "Tudo perfeito, desde o atendimento até a entrega. Qualidade impecável!", photoUrl: null },
  { id: 5, name: "Fernanda L.", stars: 5, review: "A torta de morango é a melhor que já comi!", photoUrl: null },
];

const ReviewsSection = () => {
   const carouselSettings = {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: false, // Desabilitar loop se tiver poucos itens
    autoplay: { delay: 7000 },
    pagination: { clickable: true },
    navigation: true,
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
    },
  };

  return (
    <section className="py-16 bg-background">
      <Container>
        <SectionTitle>Quem provou, amou! ❤️</SectionTitle>
        <Carousel settings={carouselSettings} key={reviews.length}>
          {reviews.map(review => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default ReviewsSection;