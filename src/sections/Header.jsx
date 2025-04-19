'use client'; // Necessário para estado e lógica futura de auth

import React, { useState } from 'react'; // Importar useState
import Link from 'next/link'; // Importar Link
import Container from '../components/Container';
import Logo from '../components/Logo';
import Navigation from '../components/Navigation';
import Button from '../components/Button'; // Importar Button
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  // --- Placeholder Auth State ---
  // No futuro, este estado virá de um Contexto, Zustand, Redux, etc.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const user = useAuthStore(state => state.user); // Exemplo futuro
  // ----------------------------

  // Simulação de login/logout para teste (remover depois)
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);


  return (
    // Adicionado py-2 para um padding menor se desejado, ajuste conforme o visual
    <header className="bg-background shadow-md sticky top-0 z-50 py-2">
      <Container className="flex justify-between items-center">
        <Logo />
        <div className="flex items-center"> {/* Container para Nav e Ícones/Botão */}
            <Navigation /> {/* Inclui botão mobile e nav desktop */}
            <div className="flex items-center space-x-4 ml-4 md:ml-6"> {/* Ícones/Botão à direita */}
              {/* Ícone do Carrinho (sempre visível?) */}
              <button aria-label="Carrinho de compras" className="text-text-main hover:text-primary text-xl md:text-2xl transition-colors">
                <FaShoppingCart />
              </button>

              {/* Botão Entrar OU Ícone do Usuário */}
              {isLoggedIn ? (
                // Ícone do usuário logado
                <button
                  aria-label="Conta do usuário"
                  onClick={toggleLogin} // Simulação de logout
                  className="text-text-main hover:text-primary text-xl md:text-2xl transition-colors"
                >
                  <FaUserCircle />
                  {/* No futuro: <Image src={user.avatarUrl || '/images/avatar-placeholder.png'} ... /> */}
                </button>
              ) : (
                // Botão Entrar (não logado)
                // Usando o componente Button com estilo mais compacto
                <Button
                  href="/login" // Link para a página de login
                  variant="primary"
                  // Ajuste o padding/tamanho da fonte para caber bem no header
                  className="text-xs sm:text-sm !px-3 sm:!px-4 !py-1"
                  // onClick={toggleLogin} // Simulação de login
                >
                  Entrar
                </Button>
              )}
            </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;