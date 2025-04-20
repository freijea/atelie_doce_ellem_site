// infra/cloudfront_functions/image_optimizer.js

// Tamanhos gerados (320w … 1920w) e valores padrão
var SIZES = [320, 480, 640, 768, 1024, 1280, 1600, 1920];
var DEFAULT_SIZE = 1280;
var DEFAULT_EXTENSION = 'png';

/**
 * Determina o tamanho alvo baseado nos headers de dispositivo.
 * Retorna um número (p.ex. 640, 1024, etc).
 */
function getTargetSize(headers) {
  var mobileHeader  = headers['cloudfront-viewer-device-is-mobile'];
  var tabletHeader  = headers['cloudfront-viewer-device-is-tablet'];
  var desktopHeader = headers['cloudfront-viewer-device-is-desktop'];
  var tvHeader      = headers['cloudfront-viewer-device-is-smarttv'];

  var isMobile  = mobileHeader  && mobileHeader.value  === 'true';
  var isTablet  = tabletHeader  && tabletHeader.value  === 'true';
  var isDesktop = desktopHeader && desktopHeader.value === 'true';
  var isSmartTV = tvHeader      && tvHeader.value      === 'true';

  // Logs para depuração no CloudWatch
  console.log(
    'Device Headers: mobile=' + isMobile +
    ', tablet='  + isTablet +
    ', desktop=' + isDesktop +
    ', smartTV=' + isSmartTV
  );

  if (isMobile)  { return SIZES[2]  || DEFAULT_SIZE; }  // 640w
  if (isTablet)  { return SIZES[4]  || DEFAULT_SIZE; }  // 1024w
  if (isDesktop) { return SIZES[6]  || DEFAULT_SIZE; }  // 1600w
  if (isSmartTV) { return SIZES[SIZES.length - 1] || DEFAULT_SIZE; } // 1920w

  console.log('WARN: Device type not recognized. Using default size.');
  return DEFAULT_SIZE;
}

/**
 * Handler principal da CloudFront Function. Se for uma imagem JPG/PNG/GIF/etc
 * e ainda não tiver sido redimensionada, devolve um redirect 302 para a versão
 * otimizada (size + webp/png). Caso contrário, retorna o request original.
 */
function handler(event) {
  console.log('--- CloudFront Function Handler Executing ---');

  var request = event.request;
  var headers = request.headers;
  var uri     = request.uri;

  console.log('Incoming URI: ' + uri);

  // Pega Accept header
  var acceptHdr   = headers['accept'];
  var acceptValue = acceptHdr && acceptHdr.value ? acceptHdr.value : '';
  console.log('Accept Header: ' + acceptValue);

  // Regex para detectar imagens (jpg, jpeg, png, gif, bmp, tiff)
  var imageMatch   = uri.match(/^(.+)\.(jpe?g|png|gif|bmp|tiff)$/i);
  // Regex para ignorar URLs já redimensionadas
  var alreadySized = uri.match(/-\d+w\.(webp|png)$/i);

  if (imageMatch && !alreadySized) {
    // Base da URI sem extensão
    var baseUri = imageMatch[1];

    // Determina formato alvo: webp se suportado, senão DEFAULT_EXTENSION
    var supportsWebp    = acceptValue.indexOf('image/webp') !== -1;
    var targetExtension = supportsWebp ? 'webp' : DEFAULT_EXTENSION;

    // Determina tamanho alvo
    var targetSize = getTargetSize(headers);

    // Constrói nova URI de destino
    var newUri = baseUri + '-' + targetSize + 'w.' + targetExtension;
    console.log('Redirecting to optimized URI: ' + newUri);

    // Retorna redirect 302 para o novo caminho
    return {
      statusCode: 302,
      statusDescription: 'Found',
      headers: {
        location: { value: newUri }
      }
    };
  }

  console.log('URI not matched or already sized. Passing through.');
  return request;
}
