import React from 'react';
import Link from 'next/link';
import Container from '../components/Container';
import Logo from '../components/Logo'; // Reutilizar o logo
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaFacebookSquare } from 'react-icons/fa'; // Ícones

const Footer = () => {
  return (
    <footer className="bg-secondary text-text-light mt-16 pt-10 pb-5">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1: Logo/Sobre */}
          <div className="space-y-4">
            <Logo /> {/* Pode precisar ajustar o tamanho/cor aqui */}
            <p className="text-sm">Confeitaria Artesanal feita com amor em Guarulhos, SP.</p>
          </div>

          {/* Coluna 2: Contato */}
          <div className="space-y-3">
            <h4 className="font-heading text-xl text-text-light mb-3 border-b-2 border-primary pb-1 inline-block">Contato</h4>
            <p className="flex items-center gap-2 text-sm">
              <FaPhone className="text-primary"/> (11) 91234-5678 {/* Número real */}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <FaEnvelope className="text-primary"/> contato@ateliedoceellen.com.br {/* Email real */}
            </p>
             <p className="flex items-center gap-2 text-sm">
              <FaMapMarkerAlt className="text-primary"/> Guarulhos/SP (Atendimento Online e Entregas)
            </p>
          </div>

          {/* Coluna 3: Links Úteis */}
          <div className="space-y-3">
             <h4 className="font-heading text-xl text-text-light mb-3 border-b-2 border-primary pb-1 inline-block">Links Úteis</h4>
             <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Perguntas Frequentes</Link></li>
             </ul>
          </div>

          {/* Coluna 4: Redes Sociais */}
           <div className="space-y-3">
             <h4 className="font-heading text-xl text-text-light mb-3 border-b-2 border-primary pb-1 inline-block">Redes Sociais</h4>
             <div className="flex space-x-4">
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-text-light hover:text-primary transition-colors text-3xl">
                    <FaInstagram />
                </a>
                 <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-text-light hover:text-primary transition-colors text-3xl">
                    <FaFacebookSquare />
                </a>
             </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-white border-opacity-20 pt-5 text-xs">
          &copy; {new Date().getFullYear()} Ateliê Doce Ellen. Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;