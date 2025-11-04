variable "name"                { type = string }
variable "vpc_id"              { type = string }
variable "private_subnet_ids"  { type = list(string) }
variable "engine_version"      { type = string, default = "15.5" }
variable "multi_az"            { type = bool,   default = false }
variable "instance_class"      { type = string, default = "db.t4g.medium" }
variable "allocated_storage"   { type = number, default = 50 }
variable "deletion_protection" { type = bool,   default = false }
