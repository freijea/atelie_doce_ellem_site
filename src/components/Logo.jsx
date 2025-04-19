import React from 'react';
import Image from 'next/image'; // Usar o componente Image do Next.js
import Link from 'next/link'; // Para linkar para a home
import PropTypes from 'prop-types';

const Logo = ({ className = '' }) => {
  return (
    <Link href="/" className={`inline-block ${className}`}>
      <Image
        src="/images/logo.png" // Caminho a partir da pasta public
        alt="Ateliê Doce Ellen Logo"
        width={150} // Fornecer width e height é importante para next/image
        height={50} // Ajuste as dimensões conforme seu logo
        className="h-auto" // Mantém a proporção
      />
    </Link>
  );
};

Logo.propTypes = {
  className: PropTypes.string,
};

export default Logo;