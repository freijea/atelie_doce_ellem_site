output "cloudfront_distribution_url" {
  description = "URL do site servido pelo CloudFront."
  value       = "https://${module.static_site.cloudfront_distribution_domain_name}"
}

output "s3_bucket_name" {
  description = "Nome do bucket S3 onde os arquivos estão hospedados."
  value       = module.static_site.s3_bucket_id
}