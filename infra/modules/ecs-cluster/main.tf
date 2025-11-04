resource "aws_ecs_cluster" "this" {
  name = var.name
  setting { name = "containerInsights" value = "enabled" }
}
resource "aws_cloudwatch_log_group" "this" {
  name              = "/ecs/${var.name}"
  retention_in_days = 30
}
output "cluster_arn"  { value = aws_ecs_cluster.this.arn }
output "cluster_name" { value = aws_ecs_cluster.this.name }
output "log_group"    { value = aws_cloudwatch_log_group.this.name }
