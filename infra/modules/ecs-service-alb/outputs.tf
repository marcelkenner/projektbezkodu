output "alb_dns_name" { value = aws_lb.this.dns_name }
output "alb_zone_id"  { value = aws_lb.this.zone_id }
output "task_sg_id"   { value = aws_security_group.task.id }
output "alb_sg_id"    { value = aws_security_group.alb.id }
output "service_arn"  { value = aws_ecs_service.this.arn }
output "listener_arn" { value = aws_lb_listener.https.arn }
