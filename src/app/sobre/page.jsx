import React from 'react';
import Header from '../../sections/Header'; // Usando alias @ se configurado, ou caminho relativo ../../sections/Header
import Footer from '../../sections/Footer'; // Usando alias @ se configurado, ou caminho relativo ../../sections/Footer
import AboutSection from '../../sections/AboutSection'; // Usando alias @ se configurado, ou caminho relativo ../../sections/AboutSection

// Metadata para SEO e título da aba do navegador
export const metadata = {
  title: "Sobre Nós | Ateliê Doce Ellen",
  description: "Conheça a história, missão e valores da Ateliê Doce Ellen. Confeitaria artesanal feita com amor em Guarulhos.",
};


export default function SobrePage() {
  return (
    <>
      <Header />
      <main>
        <AboutSection />
        {/* Você pode adicionar outras seções relevantes aqui se desejar */}
        {/* Ex: <CtaSection /> */}
        {/* Ex: <LocationBanner /> */}
      </main>
      <Footer />
    </>
  );
}