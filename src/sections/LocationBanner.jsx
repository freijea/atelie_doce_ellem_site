import React from 'react';
import Container from '../components/Container';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LocationBanner = () => (
  <section className="py-3 bg-secondary-light text-secondary text-center font-bold">
    <Container className="flex items-center justify-center gap-2">
      <FaMapMarkerAlt className="flex-shrink-0" />
      <span>Atendemos com carinho em Guarulhos e São Paulo!</span>
    </Container>
  </section>
);

export default LocationBanner;