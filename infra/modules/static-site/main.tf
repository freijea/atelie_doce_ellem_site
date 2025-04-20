# ---- S3 Bucket ----
resource "aws_s3_bucket" "site" {
  bucket = "${var.site_name}-bucket" # Nome do bucket único
  tags   = var.tags
}

# Bloqueia acesso público direto ao bucket (usaremos OAC)
resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Habilita website hosting APENAS para configuração de erro/index, não para acesso direto
resource "aws_s3_bucket_website_configuration" "site" {
  bucket = aws_s3_bucket.site.id

  index_document {
    suffix = var.index_document
  }

  # Para roteamento SPA (ex: /sobre levar para index.html) CloudFront lida com isso melhor
  # error_document {
  #   key = var.error_document
  # }
  # Nota: Com OAC, o S3 website endpoint não será usado diretamente.
  # A configuração de erro será feita no CloudFront.
}


# ---- CloudFront ----
resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${var.site_name}-oac"
  description                       = "Origin Access Control for ${var.site_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ---- CloudFront Cache Policy ----
resource "aws_cloudfront_cache_policy" "optimized_images" {
  name    = "${var.site_name}-optimized-images-policy"
  comment = "Cache policy for optimized image delivery"
  default_ttl = 3600  # 1 hora (same as previous default_ttl)
  max_ttl     = 86400 # 24 horas (same as previous max_ttl)
  min_ttl     = 0     # (same as previous min_ttl)

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true # Enable Brotli if desired
    enable_accept_encoding_gzip   = true # Enable Gzip

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "whitelist"
      headers {
        items = [
          "Accept",
          "CloudFront-Viewer-Device-Is-Mobile",
          "CloudFront-Viewer-Device-Is-Tablet",
          "CloudFront-Viewer-Device-Is-Desktop",
          "CloudFront-Viewer-Device-Is-SmartTV" # Include SmartTV for completeness
        ]
      }
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

# ---- CloudFront Function ----
resource "aws_cloudfront_function" "image_optimizer" {
  name    = "${var.site_name}-image-optimizer"
  runtime = "cloudfront-js-1.0" # Use a versão mais recente suportada se diferente
  comment = "Rewrites image URI based on device and WebP support"
  publish = true
  code    = file("${path.module}/../../cloudfront_functions/image_optimizer.js") # Caminho para o arquivo JS
}

# ---- CloudFront Distribution ----
resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for ${var.site_name}"
  default_root_object = var.index_document
  price_class         = "PriceClass_100" # Ou PriceClass_All para melhor performance global (mais caro)

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.site.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.site.id}"

    cache_policy_id = aws_cloudfront_cache_policy.optimized_images.id # USE THE NEW CACHE POLICY

    viewer_protocol_policy = "redirect-to-https"

    function_association {
      event_type   = "viewer-request" # Executa antes de verificar o cache
      function_arn = aws_cloudfront_function.image_optimizer.arn
    }
  }

  # Mapeia erros 403 e 404 para index.html (importante para SPAs/Next.js static export)
  custom_error_response {
    error_code            = 403
    response_page_path    = "/${var.error_document}"
    response_code         = 200
    error_caching_min_ttl = 10 # Tempo baixo para não cachear erros por muito tempo
  }
  custom_error_response {
    error_code            = 404
    response_page_path    = "/${var.error_document}"
    response_code         = 200
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none" # Ou 'whitelist'/'blacklist' se precisar restringir países
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    # Se usar custom domain no futuro, configurar ACM certificate aqui:
    # acm_certificate_arn = var.acm_certificate_arn
    # ssl_support_method = "sni-only"
  }

  # ++ Adicionando configuração de Logging ++
  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.cf_logs.bucket_domain_name
    prefix          = "cloudfront/"
  }

  tags = var.tags

  # Garante que a política do bucket de log E ownership controls existam
  depends_on = [
    aws_s3_bucket_policy.cf_logs_policy,
    aws_s3_bucket_ownership_controls.cf_logs_ownership
  ]
}

# ---- S3 Bucket Policy ----
# Permite que o CloudFront (via OAC) acesse o bucket S3
data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

# --- S3 Bucket for Logs (sem acl no bloco principal) ---
resource "aws_s3_bucket" "cf_logs" {
  bucket = "${var.site_name}-cf-logs"
  tags   = var.tags
}

# --- Ownership Controls: habilita ACLs ao usar BucketOwnerPreferred ---
resource "aws_s3_bucket_ownership_controls" "cf_logs_ownership" {
  bucket = aws_s3_bucket.cf_logs.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# --- Agora aplica o ACL log-delivery-write após ownership_controls estar ativo ---
resource "aws_s3_bucket_acl" "cf_logs_acl" {
  bucket = aws_s3_bucket.cf_logs.id
  acl    = "log-delivery-write"

  # força a criação do ACL **depois** de mudar o ownership
  depends_on = [
    aws_s3_bucket_ownership_controls.cf_logs_ownership
  ]
}

# --- Bloqueio de acesso público (continua sem expor objetos) ---
resource "aws_s3_bucket_public_access_block" "cf_logs" {
  bucket = aws_s3_bucket.cf_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  # garante que o ACL já foi aplicado
  depends_on = [
    aws_s3_bucket_acl.cf_logs_acl
  ]
}

# --- Lifecycle para expirar logs em 30 dias (opcional) ---
resource "aws_s3_bucket_lifecycle_configuration" "cf_logs_lifecycle" {
  bucket = aws_s3_bucket.cf_logs.id

  depends_on = [aws_s3_bucket_ownership_controls.cf_logs_ownership]

  rule {
    id     = "ExpireCloudFrontLogsAfter30Days"
    status = "Enabled"

    filter {
      prefix = "cloudfront/"
    }

    expiration {
      days = 30
    }
  }
}

# --- Política que autoriza o serviço de Log Delivery a escrever objetos ---
data "aws_iam_policy_document" "cf_logs_policy_doc" {
  statement {
    sid       = "AllowCloudFrontLogsDelivery"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.cf_logs.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["delivery.logs.amazonaws.com"]
    }
  }
}

resource "aws_s3_bucket_policy" "cf_logs_policy" {
  bucket = aws_s3_bucket.cf_logs.id
  policy = data.aws_iam_policy_document.cf_logs_policy_doc.json

  depends_on = [
    aws_s3_bucket_public_access_block.cf_logs,
    aws_s3_bucket_ownership_controls.cf_logs_ownership,
  ]
}
