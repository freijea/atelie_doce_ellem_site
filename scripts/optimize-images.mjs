import path from 'path';
import sharp from 'sharp';
import { sync as globSync } from 'glob'; 

const sourceDir = path.join(process.cwd(), 'out');
const imagePattern = '**/*.{jpg,jpeg,png}';
const quality = 75;

async function optimizeImages() {
  console.log(`🔍 Buscando imagens em ${sourceDir} com padrão ${imagePattern}`);
  // Usa o nome importado 'globSync' em vez de 'glob.sync'
  const imagePaths = globSync(imagePattern, { cwd: sourceDir, absolute: true, nodir: true }); // <<< CORREÇÃO AQUI

  if (imagePaths.length === 0) {
    console.log('✅ Nenhuma imagem encontrada para otimizar.');
    return;
  }

  console.log(`🚀 Otimizando ${imagePaths.length} imagens para WebP...`);

  let successCount = 0;
  let errorCount = 0;

  const optimizationPromises = imagePaths.map(async (imgPath) => {
    const parsedPath = path.parse(imgPath);
    // Previne otimizar arquivos que já são .webp (caso padrão inclua)
    if (parsedPath.ext.toLowerCase() === '.webp') return;

    const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

    try {
      const image = sharp(imgPath);
      await image
        .webp({ quality: quality, effort: 4 })
        .toFile(webpPath);
      successCount++;
    } catch (error) {
      console.error(`❌ Erro ao converter ${parsedPath.base}:`, error);
      errorCount++;
    }
  });

  await Promise.all(optimizationPromises);

  console.log('--- Otimização Concluída ---');
  console.log(`👍 Sucesso: ${successCount}`);
  console.log(`👎 Falhas: ${errorCount}`);
  console.log('---------------------------');

  if (errorCount > 0) {
       process.exit(1);
   }
}

optimizeImages();