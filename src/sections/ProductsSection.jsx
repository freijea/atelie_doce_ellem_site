'use client'; // Por causa do Carousel

import React from 'react';
import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import Button from '../components/Button';

// Mock Data
const products = [
  { id: 1, name: "Bolo de Chocolate", description: "Massa fofinha com cobertura cremosa.", imageUrl: '/images/produto-1.jpg', price: 55.00 },
  { id: 2, name: "Torta de Morango", description: "Base crocante com creme e morangos frescos.", imageUrl: '/images/produto-2.jpg', price: 65.00 },
  { id: 3, name: "Brigadeiros Gourmet", description: "Caixa com 12 unidades de sabores sortidos.", imageUrl: '/images/produto-3.jpg', price: 40.00 },
  { id: 4, name: "Cupcake Red Velvet", description: "Com delicioso cream cheese frosting.", imageUrl: '/images/produto-4.jpg', price: 8.00 },
  { id: 5, name: "Bolo de Cenoura", description: "Com cobertura generosa de chocolate.", imageUrl: '/images/produto-placeholder.jpg', price: 50.00 }, // Usando placeholder
];

const ProductsSection = () => {
   const carouselSettings = {
    slidesPerView: 1,
    spaceBetween: 15, // Menor espaço entre cards
    loop: false, // Ou true se tiver muitos produtos
    autoplay: { delay: 8000 },
    pagination: { clickable: true },
    navigation: true, // Mostrar setas
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 25 },
      1024: { slidesPerView: 4, spaceBetween: 30 }, // 4 cards em telas maiores
    },
  };

  return (
    <section id="cardapio" className="py-16 bg-gray-100">
      <Container>
        <SectionTitle>Nossos Queridinhos</SectionTitle>

        {/* Adiciona a div wrapper com padding-bottom */}
        {/* Ajuste pb-12 conforme necessário */}
        <div className="relative pb-36"> {/* << DIV ADICIONADA COM PADDING */}
          <Carousel settings={carouselSettings} key={products.length} className="product-carousel">
            {products.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </Carousel>
          {/* Indicadores agora têm espaço aqui embaixo */}
        </div>

        <div className="text-center mt-12">
          <Button variant="secondary" href="#">
            Ver Cardápio Completo
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ProductsSection;