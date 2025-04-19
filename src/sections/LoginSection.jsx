import React from 'react';
import Container from '../components/Container';
import LoginForm from '../components/LoginForm';
  // Poderia importar SectionTitle se quisesse um título maior
  // import SectionTitle from '../components/SectionTitle';

const LoginSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background to-pink-50"> {/* Fundo suave */}
      <Container className="flex flex-col items-center">
         {/* Título opcional */}
         {/* <SectionTitle className="text-primary mb-4">Acesse sua Conta</SectionTitle> */}
         <h2 className="text-3xl font-heading text-primary mb-4 text-center">Acesse sua Conta</h2>

         <p className="text-text-main text-center mb-8">
             Entre ou crie um novo usuário para fazer seus pedidos!
         </p>

         <LoginForm />

      </Container>
    </section>
  );
};

export default LoginSection;