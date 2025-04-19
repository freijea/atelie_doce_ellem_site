import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'; // 1. Importar o Link

const Button = ({ children, variant = 'primary', onClick, type = 'button', className = '', href }) => {
  const baseStyle = 'inline-block px-6 py-3 rounded-default font-body font-bold text-center cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-0.5';
  const variants = {
    primary: 'bg-primary text-text-light hover:bg-pink-700',
    secondary: 'bg-secondary text-text-light hover:bg-green-700',
  };
  const buttonClasses = `${baseStyle} ${variants[variant]} ${className}`;

  // 2. Verifica se é um link interno (começa com / mas não com //)
  const isInternalLink = href && href.startsWith('/') && !href.startsWith('//');
  // Verifica se é um link externo explícito
  const isExternalLink = href && (href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:'));


  // 3. Renderiza <Link> para rotas internas
  if (isInternalLink) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        onClick={onClick} // Permite passar onClick para Link também, se necessário
      >
        {children}
      </Link>
    );
  }

  // 4. Renderiza <a> para links externos (ou outros hrefs não internos)
  if (href) { // Se for externo ou qualquer outro href não tratado como interno
    return (
      <a
        href={href}
        className={buttonClasses}
        // Abrir links externos em nova aba por padrão
        target={isExternalLink ? '_blank' : undefined}
        rel={isExternalLink ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  // 5. Renderiza <button> se não houver href
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      // Adicionar disabled={disabled} se precisar no futuro
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  // disabled: PropTypes.bool, // Adicionar se usar
};

export default Button;