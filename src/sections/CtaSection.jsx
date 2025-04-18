import React from 'react';
import Container from '../components/Container';
import Button from '../components/Button';

const CtaSection = () => (
  <section id="pedido" className="py-10 bg-gray-100">
    <Container className="flex flex-col md:flex-row justify-around items-center gap-4 md:gap-6">
      <Button variant="secondary" className="w-full md:w-auto" href="#"> {/* Link real */}
        Peça agora
      </Button>
      <Button variant="secondary" className="w-full md:w-auto" href="#"> {/* Link real */}
        Monte seu bolo
      </Button>
      <Button variant="secondary" className="w-full md:w-auto" href="#cardapio">
        Veja nosso cardápio
      </Button>
    </Container>
  </section>
);

export default CtaSection;