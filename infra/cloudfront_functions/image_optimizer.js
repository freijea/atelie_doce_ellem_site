// scripts/optimize-images.mjs
import path from 'path';
import sharp from 'sharp';
import { sync as globSync } from 'glob';

const sourceDir = path.join(process.cwd(), 'out');
const imagePattern = '**/*.{jpg,jpeg,png}';
const quality = 75;
const widths = [320, 640, 768, 1024, 1280]; // Larguras alvo para redimensionar (adicione/remova conforme necessário)

async function optimizeImages() {
  console.log(`🔍 Buscando imagens em ${sourceDir} com padrão ${imagePattern}`);
  const imagePaths = globSync(imagePattern, { cwd: sourceDir, absolute: true, nodir: true });

  if (imagePaths.length === 0) { /* ... (sem imagens) ... */ return; }

  console.log(`🚀 Otimizando e redimensionando ${imagePaths.length} imagens para WebP...`);
  let successCount = 0;
  let errorCount = 0;

  const optimizationPromises = imagePaths.map(async (imgPath) => {
    const parsedPath = path.parse(imgPath);
    if (parsedPath.ext.toLowerCase() === '.webp') return; // Já é webp

    try {
      const image = sharp(imgPath);
      const metadata = await image.metadata();
      const originalWidth = metadata.width;

      // Gera WebP no tamanho original
      const webpPathOriginal = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
      await image.webp({ quality: quality, effort: 4 }).toFile(webpPathOriginal);
      successCount++;

      // Gera WebP redimensionado para cada largura menor que a original
      for (const width of widths) {
        if (originalWidth && width < originalWidth) {
          const resizedWebpPath = path.join(parsedPath.dir, `<span class="math-inline">\{parsedPath\.name\}\-</span>{width}w.webp`);
          await image.resize({ width: width }).webp({ quality: quality, effort: 4 }).toFile(resizedWebpPath);
          successCount++;
        }
      }

    } catch (error) {
      console.error(`❌ Erro ao processar ${parsedPath.base}:`, error);
      errorCount++;
    }
  });

  await Promise.all(optimizationPromises);
  // ... (logs de conclusão) ...
   console.log('--- Otimização Concluída ---');
   console.log(`👍 Operações bem-sucedidas (Original WebP + Tamanhos): ${successCount}`);
   console.log(`👎 Falhas: ${errorCount}`);
   console.log('---------------------------');
   if (errorCount > 0) { process.exit(1); }
}

optimizeImages();