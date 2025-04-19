/** @type {import('tailwindcss').Config} */
module.exports = { // Use module.exports se não estiver usando type="module" no package.json
    content: [
      './src/pages/**/*.{js,jsx}',
      './src/components/**/*.{js,jsx}',
      './src/app/**/*.{js,jsx}',
      "./src/sections/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#E75480',    // Rosa Principal
          secondary: '#8FBC8F',  // Verde Principal
          'secondary-light': '#D9F1D9',
          background: '#FFF8FA', // Fundo Levemente Rosado
          'text-main': '#333333',     // Texto Principal Escuro
          'text-light': '#FFFFFF',   // Texto Claro
        },
        fontFamily: {
          // As fontes serão carregadas via next/font, mas podemos manter aliases aqui
          heading: ['var(--font-pacifico)', 'cursive'],
          body: ['var(--font-roboto)', 'sans-serif'],
        },
        container: {
          center: true,
          padding: '1rem',
          screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1140px',
          },
        },
        borderRadius: {
          'default': '15px',
        }
      },
    },
    plugins: [],
  }