variable "site_name" {
  description = "Nome base para os recursos criados pelo módulo."
  type        = string
}

variable "tags" {
  description = "Tags a serem aplicadas aos recursos."
  type        = map(string)
  default     = {}
}

variable "index_document" {
  description = "Documento de índice padrão para o site."
  type        = string
  default     = "index.html"
}

variable "error_document" {
  description = "Documento de erro (para SPA routing)."
  type        = string
  default     = "index.html" # Para roteamento de SPAs Next.js exportados
}