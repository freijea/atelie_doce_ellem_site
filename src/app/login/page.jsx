import React from 'react';
import Header from '../../sections/Header'; // Ajuste o caminho se necessário
import Footer from '../../sections/Footer'; // Ajuste o caminho se necessário
import LoginSection from '../../sections/LoginSection'; // Ajuste o caminho se necessário

export const metadata = {
  title: "Login | Ateliê Doce Ellen",
  description: "Acesse sua conta ou crie um novo cadastro para fazer seus pedidos no Ateliê Doce Ellen.",
  robots: { // Evita indexação da página de login pelos buscadores
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main>
        <LoginSection />
      </main>
      <Footer />
    </>
  );
}