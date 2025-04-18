terraform {
  required_version = ">= 1.3" # Ajuste conforme necessário

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # Use uma versão recente e estável
    }
  }
}