resource "aws_db_subnet_group" "this" {
  name       = "${var.name}-db-subnets"
  subnet_ids = var.private_subnet_ids
  tags = { Name = "${var.name}-db-subnets" }
}

resource "aws_db_parameter_group" "this" {
  name   = "${var.name}-pg"
  family = "postgres15"
  parameter { name = "rds.force_ssl" value = "1" }
}

resource "aws_security_group" "db" {
  name        = "${var.name}-db-sg"
  description = "RDS PostgreSQL security group"
  vpc_id      = var.vpc_id
}

resource "aws_db_instance" "this" {
  identifier              = "${var.name}-pg"
  engine                  = "postgres"
  engine_version          = var.engine_version
  instance_class          = var.instance_class
  allocated_storage       = var.allocated_storage
  db_subnet_group_name    = aws_db_subnet_group.this.name
  parameter_group_name    = aws_db_parameter_group.this.name
  multi_az                = var.multi_az
  storage_encrypted       = true
  publicly_accessible     = false
  deletion_protection     = var.deletion_protection
  manage_master_user_password = true
  username                = "masteruser"
  vpc_security_group_ids  = [aws_security_group.db.id]
  skip_final_snapshot     = true
  backup_retention_period = 7
  auto_minor_version_upgrade = true
  tags = { Name = "${var.name}-rds" }
}
