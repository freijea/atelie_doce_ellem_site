import React from 'react';
import Header from '../sections/Header'; // Usando alias @ configurado no Next.js (ou caminho relativo)
import BannerSection from '../sections/BannerSection';
import CtaSection from '../sections/CtaSection';
import LocationBanner from '../sections/LocationBanner';
import ReviewsSection from '../sections/ReviewsSection';
import ProductsSection from '../sections/ProductsSection';
import Footer from '../sections/Footer';
// Importar outras seções aqui se necessário (ex: Sobre Nós, Contato)

export default function HomePage() {
  // Esta página em si é um Server Component por padrão
  // As seções que precisam de interatividade ('use client') funcionarão normalmente
  return (
    <>
      <Header />
      <main>
        <BannerSection />
        <CtaSection />
        <LocationBanner />
        <ReviewsSection />
        <ProductsSection />
        {/* Renderizar outras seções aqui */}
      </main>
      <Footer />
    </>
  );
}