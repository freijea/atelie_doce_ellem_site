provider "aws" {
  region = var.aws_region
  # As credenciais serão fornecidas por variáveis de ambiente
  # no GitHub Actions ou pelo seu perfil local configurado.
}