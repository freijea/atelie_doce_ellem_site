import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { sync as globSync } from 'glob';

// --- Configurações ---
const DEFAULT_SIZES = [320, 480, 640, 768, 1024, 1280, 1600, 1920];
const QUALITY_WEBP = 75;
const QUALITY_PNG = 90; // PNG é lossless, mas 'quality' afeta compressão/tamanho
const SUPPORTED_INPUT_FORMATS = '{jpg,jpeg,png,gif,tiff,bmp}'; // Adicione outros formatos que Sharp suporta se necessário

/**
 * Otimiza imagens de um diretório de origem para múltiplos tamanhos e formatos (PNG, WebP).
 *
 * @param {string} sourceDir Diretório contendo as imagens originais.
 * @param {string} outputDir Diretório onde as imagens otimizadas serão salvas.
 * @param {number[]} sizes Array com as larguras desejadas para as imagens.
 * @param {boolean} cleanSourceDir Se true, remove os arquivos originais do sourceDir após a otimização.
 */
async function optimizeImages(sourceDir, outputDir, sizes, cleanSourceDir = false) {
  console.log(`🔍 Buscando imagens em ${sourceDir} com padrão ${SUPPORTED_INPUT_FORMATS}`);
  const imagePattern = `**/*.${SUPPORTED_INPUT_FORMATS}`;
  // Garante que o diretório de saída exista
  await fs.mkdir(outputDir, { recursive: true });

  const imagePaths = globSync(imagePattern, {
    cwd: sourceDir,
    absolute: true,
    nodir: true,
    ignore: ['**/*-*.webp', '**/*-*.png'] // Ignora arquivos já otimizados se rodar de novo
  });

  if (imagePaths.length === 0) {
    console.log('✅ Nenhuma imagem encontrada para otimizar.');
    return;
  }

  console.log(`🚀 Otimizando ${imagePaths.length} imagens para ${sizes.length} tamanhos (PNG/WebP)...`);

  let successCount = 0;
  let errorCount = 0;
  const processedOriginals = new Set(); // Para rastrear originais processados para limpeza

  const optimizationPromises = imagePaths.flatMap((imgPath) => {
    const parsedPath = path.parse(imgPath);
    // Previne otimizar arquivos já no formato/nome esperado (segurança extra)
    if (parsedPath.name.match(/-\d+w$/)) return [];

    processedOriginals.add(imgPath); // Adiciona original para possível remoção

    return sizes.map(async (size) => {
      const outputNameBase = path.join(outputDir, `${parsedPath.name}-${size}w`);
      const pngPath = `${outputNameBase}.png`;
      const webpPath = `${outputNameBase}.webp`;

      try {
        const image = sharp(imgPath);
        const metadata = await image.metadata();

        // Só redimensiona se a imagem for maior que o tamanho alvo
        if (metadata.width && metadata.width > size) {
          // Gerar PNG
          await image
            .clone() // Clona para não afetar a geração WebP
            .resize({ width: size })
            .png({ quality: QUALITY_PNG, effort: 4 }) // Ajuste 'effort' se necessário
            .toFile(pngPath);

          // Gerar WebP
          await image
            .clone() // Clona da original redimensionada (ou da original se não redimensionou)
            .resize({ width: size }) // Garante o resize mesmo que não clonado antes
            .webp({ quality: QUALITY_WEBP, effort: 4 })
            .toFile(webpPath);

        } else {
           // Se a imagem já for menor ou igual, apenas converte os formatos no tamanho original
           const smallerOutputNameBase = path.join(outputDir, `${parsedPath.name}-${metadata.width || 'orig'}w`);
           const smallerPngPath = `${smallerOutputNameBase}.png`;
           const smallerWebpPath = `${smallerOutputNameBase}.webp`;

           await image.clone().png({ quality: QUALITY_PNG, effort: 4 }).toFile(smallerPngPath);
           await image.clone().webp({ quality: QUALITY_WEBP, effort: 4 }).toFile(smallerWebpPath);
           console.log(` Geração apenas para tamanho original ${metadata.width || 'orig'}w para ${parsedPath.base}`);
           // Não incrementa successCount aqui para refletir apenas os tamanhos gerados
        }
         successCount++; // Conta sucesso por tamanho/imagem
      } catch (error) {
        console.error(`❌ Erro ao processar ${parsedPath.base} para ${size}w:`, error);
        errorCount++;
      }
    });
  });


  await Promise.all(optimizationPromises);

  console.log('--- Otimização Concluída ---');
  console.log(`👍 Sucesso (tamanho/imagem): ${successCount}`);
  console.log(`👎 Falhas: ${errorCount}`);
  console.log('---------------------------');

  if (cleanSourceDir && processedOriginals.size > 0) {
    console.log(`🧹 Limpando ${processedOriginals.size} imagens originais de ${sourceDir}...`);
    let deleteSuccess = 0;
    let deleteError = 0;
    const deletePromises = Array.from(processedOriginals).map(async (originalPath) => {
      try {
        await fs.unlink(originalPath);
        deleteSuccess++;
      } catch (delError) {
        console.error(` R Erro ao deletar ${path.basename(originalPath)}:`, delError);
        deleteError++;
      }
    });
    await Promise.all(deletePromises);
    console.log(` Limpeza concluída: ${deleteSuccess} sucesso, ${deleteError} falhas.`);
  }

  if (errorCount > 0) {
       process.exit(1); // Sai com erro se houver falha na otimização
   }
}

// --- Execução (Exemplo para o contexto do build) ---
// No seu script de build (ex: package.json), você chamaria algo como:
// "build:optimize": "node ./scripts/optimize-images.mjs"
// Este bloco executa se o script for chamado diretamente
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const buildSourceDir = path.join(process.cwd(), 'out'); // Diretório de saída do build
  const buildOutputDir = path.join(process.cwd(), 'out'); // Salva no mesmo lugar
  // Chama a função com os parâmetros para o build
  optimizeImages(buildSourceDir, buildOutputDir, DEFAULT_SIZES, true) // Limpa os originais no build
    .catch(err => {
      console.error("Erro fatal na otimização de imagens:", err);
      process.exit(1);
    });
}

// Exporta a função para uso programático futuro
export default optimizeImages;