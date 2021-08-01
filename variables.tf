variable "region" {
 description = "AWS deployment region"
 type = string
 default = "eu-south-1"
}

variable "profile" {
 description = "AWS IAM user credentials"
 type = string
}

variable "environments" {
 type = list
 description = "referral environments"
}

variable "app_name" {
 type = string
 description = "Application name"
}

variable "routes" {
 type = list(object({
  method = string
  resource = string
  model = string
 }))
 description = "Available routes to send requests to"

 validation {
  condition = var.routes.*.method != "POST" || var.routes.*.method != "GET" || var.routes.*.method != "HEAD" || var.routes.*.method != "PUT" || var.routes.*.method != "PATCH" || var.routes.*.method != "PATCH" || var.routes.*.method != "OPTION"
  error_message = "Not a valid REST API method."
 }
}
