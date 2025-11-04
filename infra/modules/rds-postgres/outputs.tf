output "endpoint"    { value = aws_db_instance.this.address }
output "port"        { value = aws_db_instance.this.port }
output "sg_id"       { value = aws_security_group.db.id }
output "resource_id" { value = aws_db_instance.this.id }
output "arn"         { value = aws_db_instance.this.arn }
