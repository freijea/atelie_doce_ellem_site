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

  console.log(`🚀 Otimizando ${imagePaths.length} imagens para até ${sizes.length + 1} tamanhos (Original + menores) (PNG/WebP)...`);

  let successCount = 0;
  let errorCount = 0;
  const processedOriginals = new Set();

  // Usamos Promise.all no final, mas coletamos promessas aqui
  const allPromises = [];

  for (const imgPath of imagePaths) {
    const parsedPath = path.parse(imgPath);
    if (parsedPath.name.match(/-\d+w$/)) continue; // Skip already sized

    processedOriginals.add(imgPath);

    // Processa cada imagem individualmente para melhor controle de fluxo e erros
    const imageProcessingPromise = (async () => {
      let generatedCountForImage = 0;
      try {
        const image = sharp(imgPath);
        const metadata = await image.metadata();
        const originalWidth = metadata.width;

        if (!originalWidth) {
          console.warn(` WARN: Skipping ${parsedPath.base} - could not read metadata.`);
          return; // Pula para a próxima imagem no loop for...of
        }

        // 1. Gerar versão no tamanho original
        const origOutputNameBase = path.join(outputDir, `${parsedPath.name}-${originalWidth}w`);
        const origPngPath = `${origOutputNameBase}.png`;
        const origWebpPath = `${origOutputNameBase}.webp`;
        try {
          await image.clone().png({ quality: QUALITY_PNG, effort: 4 }).toFile(origPngPath);
          await image.clone().webp({ quality: QUALITY_WEBP, effort: 4 }).toFile(origWebpPath);
          console.log(`👍 Gerado tamanho original ${originalWidth}w (PNG/WebP) para ${parsedPath.base}`);
          generatedCountForImage++;
        } catch (error) {
          console.error(`❌ Erro ao gerar tamanho original ${originalWidth}w para ${parsedPath.base}:`, error);
          errorCount++;
        }

        // 2. Gerar tamanhos menores definidos em SIZES
        // Ordena SIZES numericamente para garantir o break correto (já está ordenado, mas por segurança)
        const sortedSizes = [...sizes].sort((a, b) => a - b);
        for (const size of sortedSizes) {
          if (size < originalWidth) {
            const outputNameBase = path.join(outputDir, `${parsedPath.name}-${size}w`);
            const pngPath = `${outputNameBase}.png`;
            const webpPath = `${outputNameBase}.webp`;
            try {
              const resizer = image.clone().resize({ width: size });
              await resizer.clone().png({ quality: QUALITY_PNG, effort: 4 }).toFile(pngPath);
              await resizer.clone().webp({ quality: QUALITY_WEBP, effort: 4 }).toFile(webpPath);
              console.log(`👍 Gerado tamanho menor ${size}w (PNG/WebP) para ${parsedPath.base}`);
              generatedCountForImage++;
            } catch (error) {
              console.error(`❌ Erro ao processar ${parsedPath.base} para ${size}w:`, error);
              errorCount++;
            }
          } else {
            // Já que SIZES está ordenado, não precisamos gerar tamanhos maiores
            break; // Sai do loop de sizes para esta imagem
          }
        } // Fim loop sizes

      } catch (error) { // Captura erro inicial (sharp(imgPath), metadata)
        console.error(`❌ Erro inicial ao processar ${parsedPath.base}:`, error);
        errorCount++;
      }
      successCount += generatedCountForImage; // Adiciona contagem da imagem ao total
    })(); // Fim IIFE processamento da imagem

    allPromises.push(imageProcessingPromise);

  } // Fim loop imagePaths

  // Espera todas as imagens serem processadas
  await Promise.all(allPromises);

  console.log('--- Otimização Concluída ---');
  // Ajusta a contagem total de sucessos (agora representa versões geradas)
  console.log(`👍 Versões geradas: ${successCount}`);
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
// Este bloco executa se o script for chamado diretamente
// Correção: Usar pathToFileURL para comparar URLs corretamente em diferentes OS
if (pathToFileURL(process.argv[1]).href === import.meta.url) {
  console.log('--- Executando otimização via execução direta ---'); // Log de depuração
  const buildSourceDir = path.join(process.cwd(), 'out'); // Diretório de saída do build
  const buildOutputDir = path.join(process.cwd(), 'out'); // Salva no mesmo lugar
  // Chama a função com os parâmetros para o build
  optimizeImages(buildSourceDir, buildOutputDir, DEFAULT_SIZES, true) // Limpa os originais no build
    .then(() => console.log('--- Otimização via execução direta concluída com sucesso ---')) // Log de sucesso
    .catch(err => {
      console.error("Erro fatal na otimização de imagens:", err);
      process.exit(1);
    });
} else {
  console.log(`--- Script importado, não executando otimização automaticamente. Comparação: argv[1] href='${pathToFileURL(process.argv[1]).href}', import.meta.url='${import.meta.url}' ---`); // Log do caso 'else'
}

// Exporta a função para uso programático futuro
export default optimizeImages;