variable "name" { type = string }
variable "az_count" { type = number, default = 2 }
variable "cidr_block" { type = string, default = "10.30.0.0/16" }
variable "create_nat_gateway" { type = bool, default = true }
