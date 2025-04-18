terraform {
  backend "s3" {
    bucket         = "backend-remoto-terraform-717881505697"
    key            = "atelie-doce-ellem-site/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "backend-remoto-terraform"
  }
} 