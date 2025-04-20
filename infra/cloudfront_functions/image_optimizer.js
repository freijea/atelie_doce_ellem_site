// infra/cloudfront_functions/image_optimizer.js

// Tamanhos que foram gerados (devem corresponder aos do script optimize-images.mjs)
// Ordenados do menor para o maior
const SIZES = [320, 480, 640, 768, 1024, 1280, 1600, 1920];
const DEFAULT_SIZE = 1280; // Tamanho padrão se a detecção falhar
const DEFAULT_EXTENSION = 'png'; // Formato padrão se não suportar webp

function getTargetSize(headers) {
    // Leitura segura dos headers usando optional chaining
    const isMobile = headers['cloudfront-viewer-device-is-mobile']?.value === 'true';
    const isTablet = headers['cloudfront-viewer-device-is-tablet']?.value === 'true';
    const isDesktop = headers['cloudfront-viewer-device-is-desktop']?.value === 'true';
    const isSmartTV = headers['cloudfront-viewer-device-is-smarttv']?.value === 'true';

    // Log para depuração (visível no CloudWatch Logs)
    console.log("Device Headers:", JSON.stringify({
        isMobile,
        isTablet,
        isDesktop,
        isSmartTV
    }));

    // Lógica de seleção de tamanho (sem alterações)
    if (isMobile) return SIZES[2] || DEFAULT_SIZE; // Ex: 640w
    if (isTablet) return SIZES[4] || DEFAULT_SIZE; // Ex: 1024w
    if (isDesktop) return SIZES[6] || DEFAULT_SIZE; // Ex: 1600w
    if (isSmartTV) return SIZES[SIZES.length - 1] || DEFAULT_SIZE; // Ex: 1920w

    console.log("WARN: Device type not explicitly recognized. Using default size.");
    return DEFAULT_SIZE;
}

function handler(event) {
    console.log("--- CloudFront Function Handler Executing ---"); // Log inicial
    var request = event.request;
    var headers = request.headers;
    var uri = request.uri;

    // Log para depuração (visível no CloudWatch Logs)
    console.log("Incoming URI:", uri);
    console.log("Accept Header:", headers.accept?.value || 'Not Present');

    // Verifica se a URI é para uma imagem comum (ignora case)
    // E se NÃO JÁ CONTÉM um padrão de tamanho (evita loops ou reescrita desnecessária)
    const imageMatch = uri.match(/^(.+)\.(jpe?g|png|gif|bmp|tiff)$/i);
    const alreadySized = uri.match(/-\d+w\.(webp|png)$/i);

    if (imageMatch && !alreadySized) {
        const baseUri = imageMatch[1]; // Parte da URI antes da extensão (ex: /images/bolo)
        // const originalExtension = imageMatch[2]; // Extensão original (não usada no momento)

        // 1. Determina o formato (WebP ou PNG)
        var supportsWebp = headers.accept && headers.accept.value.includes('image/webp');
        var targetExtension = supportsWebp ? 'webp' : DEFAULT_EXTENSION;

        // 2. Determina o tamanho com base nos headers do viewer
        var targetSize = getTargetSize(headers);

        // 3. Constrói a nova URI
        var newUri = `${baseUri}-${targetSize}w.${targetExtension}`;

        console.log(`Rewriting URI: ${uri} -> ${newUri}`); // Log da reescrita
        request.uri = newUri;
    } else {
        console.log("URI not matched or already sized. Passing through.");
    }

    return request;
}