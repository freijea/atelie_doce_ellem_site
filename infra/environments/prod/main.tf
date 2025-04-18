module "static_site" {
  source = "../../modules/static-site" # Caminho para o módulo local

  site_name = var.site_name
  tags      = var.tags
  # Poderia adicionar mais variáveis aqui se o módulo precisasse (ex: custom domain)
}