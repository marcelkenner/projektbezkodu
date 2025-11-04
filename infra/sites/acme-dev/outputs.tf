output ""vpc_id""         { value = module.vpc.vpc_id }
output ""api_url""        { value = ""https://api.projektbezkodu.example.com"" }
output ""cms_url""        { value = ""https://cms.projektbezkodu.example.com"" }
output ""frontend_url""   { value = ""https://projektbezkodu.example.com"" }
output ""rds_endpoint""   { value = module.rds.endpoint }
output ""django_task_sg"" { value = module.svc_django.task_sg_id }
output ""strapi_task_sg"" { value = module.svc_strapi.task_sg_id }
