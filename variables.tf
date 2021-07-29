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