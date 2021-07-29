terraform {
 backend "s3" {
  bucket = "tantosvago-terraform-states"
  key    = "serverless/random-service/terraform.tfstate"
  region = "eu-south-1"
 }
}