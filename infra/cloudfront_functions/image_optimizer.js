// infra/cloudfront_functions/image_optimizer.js

// Tamanhos que foram gerados (devem corresponder aos do script optimize-images.mjs)
// Ordenados do menor para o maior
const SIZES = [320, 480, 640, 768, 1024, 1280, 1600, 1920];
const DEFAULT_SIZE = 1280; // Tamanho padrão se a detecção falhar
const DEFAULT_EXTENSION = 'png'; // Formato padrão se não suportar webp

function getTargetSize(headers) {
    // Os headers CloudFront-Viewer-Device-* podem não estar presentes se não encaminhados
    // ou se o CloudFront não conseguiu detectar.
    const isMobile = headers['cloudfront-viewer-device-is-mobile']?.value === 'true';
    const isTablet = headers['cloudfront-viewer-device-is-tablet']?.value === 'true';
    const isDesktop = headers['cloudfront-viewer-device-is-desktop']?.value === 'true';
    const isSmartTV = headers['cloudfront-viewer-device-is-smarttv']?.value === 'true'; // Pode usar se relevante

    if (isMobile) return SIZES[2] || DEFAULT_SIZE; // Ex: 640w para mobile
    if (isTablet) return SIZES[4] || DEFAULT_SIZE; // Ex: 1024w para tablet
    if (isDesktop) return SIZES[6] || DEFAULT_SIZE; // Ex: 1600w para desktop
    if (isSmartTV) return SIZES[SIZES.length - 1] || DEFAULT_SIZE; // Maior tamanho para TV

    // Se nenhum header específico for true, retorna um tamanho padrão razoável
    // Pode acontecer em cenários não previstos ou se headers não encaminhados corretamente.
    console.log("WARN: Device type header not found or recognized. Using default size.");
    return DEFAULT_SIZE;
}

function handler(event) {
    var request = event.request;
    var headers = request.headers;
    var uri = request.uri;

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

        // console.log(`Rewriting URI: ${uri} -> ${newUri} (Size: ${targetSize}w, Format: ${targetExtension})`);
        request.uri = newUri;
    }
    // Se não for uma imagem ou já estiver no formato otimizado, retorna a requisição original

    return request;
}