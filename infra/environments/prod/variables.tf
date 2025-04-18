variable "aws_region" {
  description = "Região AWS para deploy dos recursos principais."
  type        = string
  default     = "sa-east-1" # Ou a região desejada para S3/CloudFront
}

variable "site_name" {
  description = "Nome base para os recursos (usado em tags, nomes de bucket, etc.)."
  type        = string
  default     = "atelie-doce-ellen-prod"
}

variable "tags" {
  description = "Tags comuns para aplicar aos recursos."
  type        = map(string)
  default = {
    Environment = "production"
    Project     = "AtelieDoceEllen"
    ManagedBy   = "Terraform"
  }
}