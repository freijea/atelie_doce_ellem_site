output "cloudfront_distribution_id" {
  description = "ID da distribuição CloudFront."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_distribution_domain_name" {
  description = "Domain name da distribuição CloudFront."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "s3_bucket_id" {
  description = "ID (nome) do bucket S3."
  value       = aws_s3_bucket.site.id
}

output "s3_bucket_arn" {
  description = "ARN do bucket S3."
  value       = aws_s3_bucket.site.arn
}