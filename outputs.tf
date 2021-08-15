output "lambda_ecr_repository_uri" {
 description = "Lambda Docker container ECR repository URI"

 value = aws_ecr_repository.lambda.repository_url
}

output "function_name" {
 description = "Name of the Lambda function."

 value = aws_lambda_function.main.function_name
}

output "base_urls" {
 description = "Base URLs for API Gateway stages."

 value = aws_apigatewayv2_stage.lambda[*].invoke_url
}