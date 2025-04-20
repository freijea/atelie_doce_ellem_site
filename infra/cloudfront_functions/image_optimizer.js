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
  console.log('--- CloudFront Function Handler Executing ---');

  var request = event.request;
  var headers = request.headers;
  var uri     = request.uri;

  console.log('Incoming URI: ' + uri);

  var acceptHdr   = headers['accept'];
  var acceptValue = acceptHdr && acceptHdr.value ? acceptHdr.value : 'Not Present';
  console.log('Accept Header: ' + acceptValue);

  // Só processa imagens comuns e que ainda não tenham sido redimensionadas
  var imageMatch   = uri.match(/^(.+)\.(jpe?g|png|gif|bmp|tiff)$/i);
  var alreadySized = uri.match(/-\d+w\.(webp|png)$/i);

  if (imageMatch && !alreadySized) {
    var baseUri = imageMatch[1];

    // Checa se aceita WebP
    var supportsWebp     = acceptValue.indexOf('image/webp') !== -1;
    var targetExtension  = supportsWebp ? 'webp' : DEFAULT_EXTENSION;
    var targetSize       = getTargetSize(headers);
    var newUri           = baseUri + '-' + targetSize + 'w.' + targetExtension;

    console.log('Rewriting URI: ' + uri + ' -> ' + newUri);
    request.uri = newUri;
  } else {
    console.log('URI not matched or already sized. Passing through.');
  }

  return request;
}
