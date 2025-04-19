// infra/cloudfront_functions/image_optimizer.js
function handler(event) {
  var request = event.request;
  var headers = request.headers;
  var uri = request.uri;

  // Verifica se o header Accept existe e indica suporte a WebP
  // Adicionado tratamento extra para caso 'headers' ou 'accept' não existam
  var acceptHeader = '';
  if (headers && headers.accept) {
      acceptHeader = headers.accept.value;
  }
  var supportsWebp = acceptHeader.includes('image/webp');

  // Verifica se a URI é para uma imagem JPG/JPEG/PNG (ignorando case)
  if (supportsWebp && uri && uri.match(/\.(jpe?g|png)$/i)) {
      // Remove a extensão original e adiciona .webp
      var newUri = uri.replace(/\.(jpe?g|png)$/i, '.webp');
      request.uri = newUri;
  }
  // Se não suporta WebP ou não é imagem JPG/PNG ou uri é inválida, retorna a requisição original

  return request;
}