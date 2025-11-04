resource "aws_security_group" "alb" {
  name        = "${var.service_name}-alb-sg"
  description = "ALB SG"
  vpc_id      = var.vpc_id
  ingress { from_port = 443 to_port = 443 protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  egress  { from_port = 0   to_port = 0   protocol = "-1"  cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_security_group" "task" {
  name        = "${var.service_name}-task-sg"
  description = "ECS task SG"
  vpc_id      = var.vpc_id
  ingress { from_port = var.container_port to_port = var.container_port protocol = "tcp" security_groups = [aws_security_group.alb.id] }
  egress  { from_port = 0 to_port = 0 protocol = "-1" cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_lb" "this" {
  name               = "${var.service_name}-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids
}

resource "aws_lb_target_group" "this" {
  name        = "${var.service_name}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id
  health_check {
    path                = var.healthcheck_path
    matcher             = "200-399"
    interval            = 30
    unhealthy_threshold = 5
  }
}

resource "aws_acm_certificate" "this" {
  domain_name       = var.hostnames_for_certificate[0]
  validation_method = "DNS"
  subject_alternative_names = slice(var.hostnames_for_certificate, 1, length(var.hostnames_for_certificate))
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }
  zone_id = var.hosted_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate_validation.this.certificate_arn
  default_action { type = "forward" target_group_arn = aws_lb_target_group.this.arn }
}

data "aws_region" "current" {}

data "aws_iam_policy_document" "task_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals { type = "Service" identifiers = ["ecs-tasks.amazonaws.com"] }
  }
}

resource "aws_iam_role" "task_execution" {
  name               = "${var.service_name}-exec-role"
  assume_role_policy = data.aws_iam_policy_document.task_assume.json
}
resource "aws_iam_role" "task_role" {
  name               = "${var.service_name}-task-role"
  assume_role_policy = data.aws_iam_policy_document.task_assume.json
}

resource "aws_iam_role_policy_attachment" "exec_ecr" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
resource "aws_iam_policy" "secrets_read" {
  name        = "${var.service_name}-secrets-read"
  description = "Allow GetSecretValue for injected secrets"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = ["secretsmanager:GetSecretValue"],
      Resource = values(var.secrets)
    }]
  })
}
resource "aws_iam_role_policy_attachment" "task_secrets" {
  role       = aws_iam_role.task_role.name
  policy_arn = aws_iam_policy.secrets_read.arn
}

resource "aws_cloudwatch_log_group" "service" {
  name              = "/ecs/${var.service_name}"
  retention_in_days = 30
}

locals {
  env_list = [for k, v in var.environment : { name = k, value = v }]
  sec_list = [for k, v in var.secrets     : { name = k, valueFrom = v }]
}

resource "aws_ecs_task_definition" "this" {
  family                   = var.service_name
  cpu                      = var.cpu
  memory                   = var.memory
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.task_execution.arn
  task_role_arn            = aws_iam_role.task_role.arn
  runtime_platform { operating_system_family = "LINUX" cpu_architecture = "X86_64" }
  container_definitions = jsonencode([{
    name      = var.service_name
    image     = var.container_image
    essential = true
    portMappings = [{ containerPort = var.container_port, hostPort = var.container_port, protocol = "tcp" }]
    environment = local.env_list
    secrets     = local.sec_list
    logConfiguration = { logDriver = "awslogs", options = {
      awslogs-group = aws_cloudwatch_log_group.service.name,
      awslogs-region = data.aws_region.current.name,
      awslogs-stream-prefix = var.service_name
    }}
    healthCheck = { command = ["CMD-SHELL", "curl -fsS http://localhost:${var.container_port}${var.healthcheck_path} || exit 1"], interval = 30, timeout = 5, retries = 3 }
  }])
}

resource "aws_ecs_service" "this" {
  name            = var.service_name
  cluster         = var.cluster_arn
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count
  enable_execute_command = var.enable_execute_command
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [aws_security_group.task.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name   = var.service_name
    container_port   = var.container_port
  }

  lifecycle { ignore_changes = [desired_count] }
}

resource "aws_route53_record" "svc_alias_a" {
  count   = var.create_route53_record ? length(var.hostnames_for_certificate) : 0
  zone_id = var.hosted_zone_id
  name    = var.hostnames_for_certificate[count.index]
  type    = "A"
  alias { name = aws_lb.this.dns_name zone_id = aws_lb.this.zone_id evaluate_target_health = true }
}
resource "aws_route53_record" "svc_alias_aaaa" {
  count   = var.create_route53_record ? length(var.hostnames_for_certificate) : 0
  zone_id = var.hosted_zone_id
  name    = var.hostnames_for_certificate[count.index]
  type    = "AAAA"
  alias { name = aws_lb.this.dns_name zone_id = aws_lb.this.zone_id evaluate_target_health = true }
}
