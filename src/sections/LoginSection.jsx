import React from 'react';
import Container from '../components/Container';
import LoginForm from '../components/LoginForm';
import SectionTitle from '../components/SectionTitle'; // Importar SectionTitle

const LoginSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background to-pink-50">
      <Container className="flex flex-col items-center">

         {/* Usando SectionTitle com tamanho 'medium' e tag 'h2' */}
         {/* Ajuste 'size' e 'as' conforme desejado para esta página */}
         <SectionTitle
            as="h2"
            size="medium" // Usando um tamanho diferente do padrão
            className="text-primary mb-4 text-center" // Controla cor, margem e alinhamento aqui
         >
             Acesse sua Conta
         </SectionTitle>

         <p className="text-text-main text-center mb-8">
             Entre ou crie um novo usuário para fazer seus pedidos!
         </p>

         <LoginForm />

      </Container>
    </section>
  );
};

export default LoginSection;