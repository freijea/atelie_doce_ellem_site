// next.config.js ou next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Outras configurações...
    output: 'export', // ESSENCIAL para exportação estática
    // Opcional: Desabilita a otimização de imagem via servidor Next.js,
    // já que não teremos um servidor rodando.
    images: {
      unoptimized: true,
    },
  };
  
  module.exports = nextConfig; // ou export default nextConfig; para mjs