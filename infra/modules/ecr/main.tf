locals { repo_map = { for name in var.repositories : name => name } }
resource "aws_ecr_repository" "repos" {
  for_each = local.repo_map
  name                 = each.value
  image_tag_mutability = "MUTABLE"
  encryption_configuration { encryption_type = "AES256" }
  image_scanning_configuration { scan_on_push = true }
  tags = { Name = each.value }
}
output "repository_urls" { value = { for k, v in aws_ecr_repository.repos : k => v.repository_url } }
