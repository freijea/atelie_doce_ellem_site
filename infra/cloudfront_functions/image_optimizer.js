// infra/cloudfront_functions/image_optimizer.js
function handler(event) {
  var request = event.request;
  var headers = request.headers;
  var uri = request.uri;

  // Verifica se o header Accept indica suporte a WebP
  var acceptHeader = headers.accept ? headers.accept.value : '';
  var supportsWebp = acceptHeader.includes('image/webp');

  // Verifica se a URI é para uma imagem JPG/JPEG/PNG (ignorando case)
  if (supportsWebp && uri.match(/\.(jpe?g|png)$/i)) {
      // Remove a extensão original e adiciona .webp
      var newUri = uri.replace(/\.(jpe?g|png)$/i, '.webp');
      // console.log("Rewriting URI from " + uri + " to " + newUri); // Log (visível no CloudWatch Logs)
      request.uri = newUri;
  }
  // Se não suporta WebP ou não é imagem JPG/PNG, retorna a requisição original

  return request;
}