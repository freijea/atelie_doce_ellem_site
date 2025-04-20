console.log('--- Iniciando optimize-images.mjs ---'); // Log de depuração

import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { sync as globSync } from 'glob';
import { fileURLToPath, pathToFileURL } from 'url';

// --- Configurações ---
const DEFAULT_SIZES = [320, 480, 640, 768, 1024, 1280, 1600, 1920];
const QUALITY_WEBP = 75;
const QUALITY_PNG = 90; // PNG é lossless, mas 'quality' afeta compressão/tamanho
const SUPPORTED_INPUT_FORMATS = '{jpg,jpeg,png,gif,tiff,bmp}'; // Adicione outros formatos se necessário

/**
 * Otimiza imagens de um diretório de origem para múltiplos tamanhos e formatos (PNG, WebP).
 *
 * @param {string} sourceDir Diretório contendo as imagens originais.
 * @param {string} outputDir Diretório onde as imagens otimizadas serão salvas.
 * @param {number[]} sizes Array com as larguras desejadas para as imagens.
 * @param {boolean} cleanSourceDir Se true, remove arquivos originais após otimização.
 */
async function optimizeImages(sourceDir, outputDir, sizes, cleanSourceDir = false) {
  console.log(`🔍 Buscando imagens em ${sourceDir} com padrão ${SUPPORTED_INPUT_FORMATS}`);
  await fs.mkdir(outputDir, { recursive: true });

  const pattern = `**/*.${SUPPORTED_INPUT_FORMATS}`;
  const imagePaths = globSync(pattern, {
    cwd: sourceDir,
    absolute: true,
    nodir: true,
    ignore: ['**/*-*.webp', '**/*-*.png']
  });

  if (imagePaths.length === 0) {
    console.log('✅ Nenhuma imagem encontrada para otimizar.');
    return;
  }

  console.log(`🚀 Otimizando ${imagePaths.length} imagens para ${sizes.length + 1} tamanhos (PNG/WebP)...`);
  let successCount = 0;
  let errorCount = 0;
  const processedOriginals = new Set();
  const allPromises = [];

  for (const imgPath of imagePaths) {
    const parsed = path.parse(imgPath);
    if (parsed.name.match(/-\d+w$/)) continue;
    processedOriginals.add(imgPath);

    allPromises.push((async () => {
      let generatedCountForImage = 0;
      try {
        const image = sharp(imgPath);
        const metadata = await image.metadata();
        const originalWidth = metadata.width;

        if (!originalWidth) {
          console.warn(` WARN: Skipping ${parsed.base} - could not read metadata.`);
          return; // Pula para a próxima imagem no loop for...of
        }

        // 1. Gerar versão no tamanho original
        const origOutputNameBase = path.join(outputDir, `${parsed.name}-${originalWidth}w`);
        const origPngPath = `${origOutputNameBase}.png`;
        const origWebpPath = `${origOutputNameBase}.webp`;
        try {
          await image.clone().png({ quality: QUALITY_PNG, effort: 4 }).toFile(origPngPath);
          await image.clone().webp({ quality: QUALITY_WEBP, effort: 4 }).toFile(origWebpPath);
          console.log(`👍 Gerado tamanho original ${originalWidth}w (PNG/WebP) para ${parsed.base}`);
          generatedCountForImage += 2;
        } catch (error) {
          console.error(`❌ Erro ao gerar tamanho original ${originalWidth}w para ${parsed.base}:`, error);
          errorCount++; // Conta como 1 falha no par
        }

        // 2. Gerar tamanhos menores definidos em SIZES
        const sortedSizes = [...sizes].sort((a, b) => a - b);
        for (const size of sortedSizes) {
          if (size < originalWidth) {
            const outputNameBase = path.join(outputDir, `${parsed.name}-${size}w`);
            const pngPath = `${outputNameBase}.png`;
            const webpPath = `${outputNameBase}.webp`;
            try {
              const resizer = image.clone().resize({ width: size });
              await resizer.clone().png({ quality: QUALITY_PNG, effort: 4 }).toFile(pngPath);
              await resizer.clone().webp({ quality: QUALITY_WEBP, effort: 4 }).toFile(webpPath);
              console.log(`👍 Gerado tamanho menor ${size}w (PNG/WebP) para ${parsed.base}`);
              generatedCountForImage += 2;
            } catch (error) {
              console.error(`❌ Erro ao processar ${parsed.base} para ${size}w:`, error);
              errorCount++; // Conta como 1 falha no par
            }
          } else {
            break; // Sai do loop de sizes para esta imagem
          }
        } // Fim loop sizes

        // 3. ++ Garantir Geração Adicional de 1280w (se definido e ainda não gerado) ++
        const targetSize1280 = 1280;
        // Verifica se 1280w está nos tamanhos desejados E se ainda não foi gerado
        // (Não foi gerado se originalWidth != 1280 E 1280 >= originalWidth)
        const alreadyGenerated1280 = originalWidth === targetSize1280 ||
                                     (targetSize1280 < originalWidth && sizes.includes(targetSize1280));

        if (sizes.includes(targetSize1280) && !alreadyGenerated1280) {
            console.log(` INFO: Garantindo geração adicional de ${targetSize1280}w para ${parsed.base} (Original: ${originalWidth}w)`);
            const outputNameBase1280 = path.join(outputDir, `${parsed.name}-${targetSize1280}w`);
            const pngPath1280 = `${outputNameBase1280}.png`;
            const webpPath1280 = `${outputNameBase1280}.webp`;
            try {
              // Usa a imagem original (pode fazer upscale se originalWidth < 1280)
              const resizer1280 = image.clone().resize({ width: targetSize1280 });
              await resizer1280.clone().png({ quality: QUALITY_PNG, effort: 4 }).toFile(pngPath1280);
              await resizer1280.clone().webp({ quality: QUALITY_WEBP, effort: 4 }).toFile(webpPath1280);
              console.log(`👍 Gerado tamanho ADICIONAL ${targetSize1280}w (PNG/WebP) para ${parsed.base}`);
              generatedCountForImage += 2; // Conta os dois arquivos extras
            } catch (error) {
              console.error(`❌ Erro ao gerar tamanho ADICIONAL ${targetSize1280}w para ${parsed.base}:`, error);
              errorCount++;
            }
        }

      } catch (error) { // Captura erro inicial (sharp(imgPath), metadata)
        console.error(`❌ Erro inicial ao processar ${parsed.base}:`, error);
        errorCount++;
      }
      successCount += generatedCountForImage; // Adiciona contagem da imagem ao total
    })());
  }

  await Promise.all(allPromises);

  console.log('--- Otimização Concluída ---');
  console.log(`👍 Gerados: ${successCount}`, `👎 Falhas: ${errorCount}`);

  if (cleanSourceDir && processedOriginals.size > 0) {
    for (const f of processedOriginals) {
      try { await fs.unlink(f); } catch {}
    }
    console.log(`🧹 ${processedOriginals.size} arquivos originais removidos.`);
  }

  if (errorCount > 0) process.exit(1);
}

// --- Execução direta (build export) ---
if (pathToFileURL(process.argv[1]).href === import.meta.url) {
  console.log('--- Iniciando otimização via execução direta ---');

  const args = process.argv.slice(2);
  const sourceDir = args[0] || path.join(process.cwd(), 'out', 'images');
  const outputDir = args[1] || sourceDir;

  console.log(`🔧 SourceDir: ${sourceDir}`);
  console.log(`📂 OutputDir: ${outputDir}`);

  optimizeImages(sourceDir, outputDir, DEFAULT_SIZES, true)
    .then(() => console.log('--- Otimização concluída com sucesso ---'))
    .catch(err => {
      console.error('❌ Erro fatal na otimização de imagens:', err);
      process.exit(1);
    });
}

export default optimizeImages;
