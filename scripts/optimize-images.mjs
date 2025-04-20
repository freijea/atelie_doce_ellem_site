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
      try {
        const img = sharp(imgPath);
        const meta = await img.metadata();
        if (!meta.width) throw new Error('Metadata width missing');

        // versão no tamanho original
        const origBase = path.join(outputDir, `${parsed.name}-${meta.width}w`);
        await img.clone().png({ quality: QUALITY_PNG }).toFile(`${origBase}.png`);
        await img.clone().webp({ quality: QUALITY_WEBP }).toFile(`${origBase}.webp`);
        successCount += 2;

        // versões menores
        for (const size of [...sizes].sort((a,b)=>a-b)) {
          if (size < meta.width) {
            const base2 = path.join(outputDir, `${parsed.name}-${size}w`);
            const r = img.clone().resize({ width: size });
            await r.clone().png({ quality: QUALITY_PNG }).toFile(`${base2}.png`);
            await r.clone().webp({ quality: QUALITY_WEBP }).toFile(`${base2}.webp`);
            successCount += 2;
          } else break;
        }
      } catch (e) {
        console.error(`❌ Erro processando ${parsed.base}:`, e);
        errorCount++;
      }
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
