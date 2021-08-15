// creates lambda function which will execute the code
resource "aws_lambda_function" "main" {
 function_name = join("-", [var.app_name, "lambda"])

 image_uri = "${aws_ecr_repository.lambda.repository_url}:latest"

 runtime = "nodejs12.x"
 handler = "dist/serverless.handler"

 role = aws_iam_role.lambda_exec.arn

 memory_size = 1024

 package_type = "Image"

 depends_on = [aws_ecr_repository.lambda]

 tags = {
  Name = join("-", [var.app_name, "lambda"])
 }
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
resource "aws_iam_role_policy_attachment" "assume_policy" {
 role       = aws_iam_role.lambda_exec.name
 policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}