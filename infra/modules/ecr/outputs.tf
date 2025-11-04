output "repository_arns" { value = { for k, v in aws_ecr_repository.repos : k => v.arn } }
