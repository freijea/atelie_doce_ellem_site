// Precisa ser 'use client' por causa do componente Navigation que tem state
'use client';

import React from 'react';
import Container from '../components/Container';
import Logo from '../components/Logo';
import Navigation from '../components/Navigation';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa'; // Ícones

const Header = () => {
  return (
    <header className="bg-background shadow-md py-3">
      <Container className="flex justify-between items-center">
        <Logo />
        <div className="flex items-center"> {/* Container para Nav e Ícones */}
            <Navigation /> {/* Inclui botão mobile e nav desktop */}
            <div className="flex items-center space-x-4 ml-6"> {/* Ícones à direita */}
              <button aria-label="Carrinho de compras" className="text-text-main hover:text-primary text-2xl transition-colors">
                <FaShoppingCart />
              </button>
              <button aria-label="Conta do usuário" className="text-text-main hover:text-primary text-2xl transition-colors">
                <FaUserCircle />
              </button>
            </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;