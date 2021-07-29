// creates lambda function which will execute the code
resource "aws_lambda_function" "main" {
 function_name = var.app_name

 s3_bucket = aws_s3_bucket.lambda_bucket.id
 s3_key    = aws_s3_bucket_object.lambda_object.key

 runtime = "nodejs12.x"
 handler = "index.handler"

 source_code_hash = data.archive_file.lambda_radom_service.output_base64sha256

 role = aws_iam_role.lambda_exec.arn
}
// creates logs group in CloudWatch consumed by the lambda function
resource "aws_cloudwatch_log_group" "lambda_group" {
 name = "/aws/lambda/${aws_lambda_function.main.function_name}"

 retention_in_days = 30
}
// creates the IAM role associated to the main lambda function
resource "aws_iam_role" "lambda_exec" {
  name = join("-", [var.app_name, "role"])

  assume_role_policy = jsonencode({
   Version = "2012-10-17"
   Statement = [{
     Action = "sts:AssumeRole"
     Effect = "Allow"
     Sid    = ""
     Principal = {
       Service = "lambda.amazonaws.com"
     }
    }
   ]
  })
}
// lambda policy with basic execution policy
resource "aws_iam_role_policy_attachment" "lambda_policy" {
 role       = aws_iam_role.lambda_exec.name
 policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}