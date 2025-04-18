import React from 'react';
import Container from '../components/Container';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Ícone

const LocationBanner = () => (
  <section className="py-4 bg-secondary text-text-light text-center font-semibold">
    <Container className="flex items-center justify-center gap-2">
      <FaMapMarkerAlt />
      <span>Atendemos com carinho em Guarulhos e São Paulo!</span>
    </Container>
  </section>
);

export default LocationBanner;