import React from 'react';
import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import ParagraphGroup from '../components/ParagraphGroup';
// Importe uma imagem relevante se desejar (ex: foto da fundadora, do ateliê)
// import Image from 'next/image';

// Dados de Texto (usando o copywriting fornecido)
const aboutTitle = "🍰 Sobre Nós"; // Título principal da seção

const historyTitle = "A Nossa História";
const historyParagraphs = [
  "Tudo começou com uma paixão que cresceu dentro de casa, entre formas de bolo, cheirinho de massa fresca e olhares encantados com cada nova criação. Em 2024, Gabrielle Evini Santos transformou esse amor em realidade ao fundar seu ateliê de confeitaria, com o propósito de levar doçura e afeto a cada cantinho de Guarulhos e região.",
  "Desde o primeiro bolo feito para presentear uma amiga até os pedidos especiais que chegam todos os dias, o que nos move é ver cada cliente sorrir ao abrir uma caixinha recheada de carinho. Nossa confeitaria nasceu com alma e permanece com essência artesanal, feita à mão, com ingredientes de qualidade e um toque de cuidado em cada detalhe."
];

const missionTitle = "Nossa Missão e Valores";
const missionParagraphs = [
  "Mais do que vender bolos e doces, nossa missão é transformar momentos simples em memórias inesquecíveis. Acreditamos que a confeitaria tem o poder de emocionar — seja no aniversário de alguém querido, num gesto de gratidão ou em um café da tarde especial."
];

// Lista de Valores (tratamento especial)
const values = [
  { icon: "✨", text: "Carinho em cada etapa: Cada massa, recheio e decoração é preparada com dedicação, como se fosse para alguém da nossa própria família." },
  { icon: "🌿", text: "Qualidade com propósito: Selecionamos ingredientes com atenção e buscamos sempre melhorar, respeitando o tempo de preparo artesanal e a confiança dos nossos clientes." },
  { icon: "🎀", text: "Afeto que se entrega: Nossos produtos chegam até você como um abraço doce, feitos com sensibilidade, atenção e o compromisso de encantar." }
];

const AboutSection = () => {
  return (
    <section className="py-16 bg-background"> {/* Fundo padrão ou pode alternar */}
      <Container>
        <SectionTitle className="text-primary mb-12">{aboutTitle}</SectionTitle>

        {/* Seção História */}
        <div className="mb-12 md:mb-16">
          <h3 className="font-heading text-3xl text-secondary mb-6 text-center md:text-left">
            {historyTitle}
          </h3>
          {/* Adicione uma imagem aqui se desejar */}
          {/* <div className="my-8 text-center">
            <Image src="/images/sobre-nos-placeholder.jpg" alt="História Ateliê Doce Ellen" width={600} height={400} className="rounded-default inline-block shadow-lg"/>
          </div> */}
          <ParagraphGroup paragraphs={historyParagraphs} className="max-w-3xl mx-auto md:mx-0" />
        </div>

        {/* Seção Missão e Valores */}
        <div>
          <h3 className="font-heading text-3xl text-secondary mb-6 text-center md:text-left">
            {missionTitle}
          </h3>
           <ParagraphGroup paragraphs={missionParagraphs} className="max-w-3xl mx-auto md:mx-0 mb-8" />

           {/* Lista de Valores */}
           <ul className="space-y-6 max-w-3xl mx-auto md:mx-0">
             {values.map((value, index) => (
               <li key={index} className="flex items-start gap-4">
                 <span className="text-2xl text-primary pt-1">{value.icon}</span>
                 <p className="font-body text-text-main text-base leading-relaxed">
                   <span className="font-bold">{value.text.split(':')[0]}:</span>{value.text.split(':')[1]}
                 </p>
               </li>
             ))}
           </ul>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;