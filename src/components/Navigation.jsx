'use client'; // Necessário para o state do menu mobile

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi'; // Ícones para mobile
import PropTypes from 'prop-types';

const navLinks = [
  { label: 'Início', href: '#inicio' }, // Usar IDs das seções ou rotas reais
  { label: 'Cardápio', href: '#cardapio' },
  { label: 'Sobre Nós', href: '/sobre' }, // Criar esta seção se necessário
  { label: 'Contato', href: '#contato' }, // Criar esta seção se necessário
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-text-main text-2xl z-50"
        onClick={toggleMenu}
        aria-label="Abrir menu"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className="flex space-x-6 items-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-body font-bold text-text-main hover:text-primary transition-colors duration-200">
                  {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation Menu (Overlay) */}
      <div
        className={`fixed inset-0 bg-background z-40 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
      >
        <nav className="h-full flex flex-col items-center justify-center">
          <ul className="flex flex-col space-y-8 items-center">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-body font-bold text-2xl text-text-main hover:text-primary transition-colors duration-200" onClick={toggleMenu}>
                    {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navigation;