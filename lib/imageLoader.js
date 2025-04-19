// lib/imageLoader.js

// Larguras que o script de otimização gera (precisa ser consistente!)
const generatedWidths = [320, 640, 768, 1024, 1280];

// A qualidade padrão que o Next.js passa parece ser 75
const defaultQuality = 75;

export default function customImageLoader({ src, width, quality = defaultQuality }) {
  // Remove a extensão original .jpg, .jpeg, .png, ou .webp (caso já venha assim)
  const imageName = src.replace(/\.(jpe?g|png|webp)$/i, '');

  // Encontra a menor largura gerada que seja >= à largura solicitada
  let bestFitWidth = generatedWidths[generatedWidths.length - 1]; // Começa com a maior
  for (const genWidth of generatedWidths) {
    if (genWidth >= width) {
      bestFitWidth = genWidth;
      break;
    }
  }
  // Poderia adicionar lógica aqui para usar a imagem .webp original (sem sufixo)
  // se 'width' for maior que a maior largura gerada, mas vamos usar a maior por enquanto.

  // Constrói a URL para o arquivo .webp redimensionado estaticamente
  // Ex: /images/produto-1-640w.webp
  // Usando template literals corretos (backticks e ${})
  const finalSrc = `${imageName}-${bestFitWidth}w.webp`;

  // Retorna o path relativo com o parâmetro de qualidade (opcional)
  return `${finalSrc}?q=${quality}`; // Agora usa as variáveis corretamente
}