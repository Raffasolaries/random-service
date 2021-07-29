output "lambda_bucket_name" {
 description = "Name of the S3 bucket used to store function code."

 value = aws_s3_bucket.lambda_bucket.id
}

output "function_name" {
 description = "Name of the Lambda function."

 value = aws_lambda_function.main.function_name
}

output "base_urls" {
 description = "Base URLs for API Gateway stages."

 value = aws_apigatewayv2_stage.lambda[*].invoke_url
}