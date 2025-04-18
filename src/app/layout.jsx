import { Pacifico, Roboto } from 'next/font/google'; // Importar fontes do Next
import "../styles/globals.css"; // Importar CSS Global
import PropTypes from 'prop-types'; // Mantenha se adicionou

// Configurar as fontes
const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'], // Pacifico só tem peso 400
  variable: '--font-pacifico', // CSS Variable para usar no Tailwind
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'], // Pesos que vamos usar
  variable: '--font-roboto', // CSS Variable
  display: 'swap',
});

// Metadata (SEO) - pode ser mais elaborado
export const metadata = {
  title: "Ateliê Doce Ellen - Confeitaria Artesanal",
  description: "Bolos, tortas, doces e confeitaria artesanal em Guarulhos e São Paulo. Feito com amor para seus momentos especiais.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${pacifico.variable} ${roboto.variable}`}>
      {/* Adicione as classes AQUI 👇 */}
      <body className="bg-background font-body text-text-main">
        {children}
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};