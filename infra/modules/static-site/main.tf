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

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600 # 1 hora - ajuste conforme necessário
    max_ttl                = 86400 # 24 horas - ajuste conforme necessário
    compress               = true
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

  tags = var.tags
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