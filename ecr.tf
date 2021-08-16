# Account id retrieval
data "aws_caller_identity" "current" {}
# Creates the ECR repository and pushes the lambda content
resource "aws_ecr_repository" "lambda" {
 name  = join("-", [var.app_name, "ecr-repository"])
 image_tag_mutability = "MUTABLE"

 image_scanning_configuration {
  scan_on_push = true
 }

 encryption_configuration {
  encryption_type = "AES256"
 }

 provisioner "local-exec" {
  working_dir = "${path.module}/code"
  command = <<-EOT
    aws ecr get-login-password --regiion ${var.region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com
    docker build -t ${var.app_name}-ecr-repository .
    docker tag ${var.app_name}-ecr-repository:latest ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com/${var.app_name}-ecr-repository:latest
    docker push ${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com/${var.app_name}-ecr-repository:latest
   EOT
 }

 tags = {
  Name = join("-", [var.app_name, "ecr-repository"])
 }
}
# ECR Repository permissions
resource "aws_ecr_repository_policy" "ecr_lambda" {
  repository = aws_ecr_repository.lambda.name

  policy = <<EOF
   {
    "Version": "2008-10-17",
    "Statement": [
     {
      "Sid": "LambdaECRImageRetrievalPolicy",
      "Effect": "Allow",
      "Principal": {
       "Service": "lambda.amazonaws.com"
      },
      "Action": [
       "ecr:BatchGetImage",
       "ecr:GetDownloadUrlForLayer"
      ]
     }
    ]
   }
   EOF
}