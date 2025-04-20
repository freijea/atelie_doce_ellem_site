// infra/cloudfront_functions/image_optimizer.js

// Tamanhos gerados (320w … 1920w) e valores padrão
var SIZES = [320, 480, 640, 768, 1024, 1280, 1600, 1920];
var DEFAULT_SIZE = 1280;
var DEFAULT_EXTENSION = 'png';

function getTargetSize(headers) {
  var mobileHeader  = headers['cloudfront-viewer-device-is-mobile'];
  var tabletHeader  = headers['cloudfront-viewer-device-is-tablet'];
  var desktopHeader = headers['cloudfront-viewer-device-is-desktop'];
  var tvHeader      = headers['cloudfront-viewer-device-is-smarttv'];

  var isMobile  = mobileHeader  && mobileHeader.value  === 'true';
  var isTablet  = tabletHeader  && tabletHeader.value  === 'true';
  var isDesktop = desktopHeader && desktopHeader.value === 'true';
  var isSmartTV = tvHeader      && tvHeader.value      === 'true';

  console.log(
    'Device Headers: mobile=' + isMobile +
    ', tablet='  + isTablet +
    ', desktop=' + isDesktop +
    ', smartTV=' + isSmartTV
  );

  if (isMobile)  { return SIZES[2]  || DEFAULT_SIZE; }  // 640
  if (isTablet)  { return SIZES[4]  || DEFAULT_SIZE; }  // 1024
  if (isDesktop) { return SIZES[6]  || DEFAULT_SIZE; }  // 1600
  if (isSmartTV) { return SIZES[ SIZES.length - 1 ] || DEFAULT_SIZE; } //1920

  console.log('WARN: Device type not recognized. Using default size.');
  return DEFAULT_SIZE;
}

function handler(event) {
  console.log("--- CloudFront Function Handler Executing ---");
  var request = event.request;
  var headers = request.headers;
  var uri = request.uri;

  console.log("Incoming URI:", uri);
  console.log("Accept Header:", headers.accept?.value || 'Not Present');

  // Regex ajustado para garantir que lida com a / inicial e captura corretamente
  const imageMatch = uri.match(/^\/(.+)\.(jpe?g|png|gif|bmp|tiff)$/i);
  const alreadySized = uri.match(/-\d+w\.(webp|png)$/i);

  if (imageMatch && !alreadySized) {
    // imageMatch[0] é a string completa (ex: /images/cliente-2.jpg)
    // imageMatch[1] é a parte capturada após a / inicial (ex: images/cliente-2)
    // imageMatch[2] é a extensão original (ex: jpg)
    const baseUriPart = imageMatch[1];

    console.log("URI Matched. Base part:", baseUriPart);

    // 1. Determina o formato (WebP ou PNG)
    var supportsWebp = headers.accept && headers.accept.value.includes('image/webp');
    var targetExtension = supportsWebp ? 'webp' : DEFAULT_EXTENSION;

    // 2. Determina o tamanho com base nos headers do viewer
    var targetSize = getTargetSize(headers);

    // 3. Constrói a nova URI, adicionando a / inicial de volta
    var newUri = `/${baseUriPart}-${targetSize}w.${targetExtension}`;

    console.log(`Rewriting URI: ${uri} -> ${newUri}`);
    request.uri = newUri;
  } else {
    // Log mais detalhado do motivo da não reescrita
    if (!imageMatch) {
      console.log("URI did not match image pattern. Passing through.");
    } else if (alreadySized) {
      console.log("URI already contains size/format pattern. Passing through.");
    }
    else {
      console.log("URI not matched or already sized (check conditions). Passing through.");
    }
  }

  return request;
}
