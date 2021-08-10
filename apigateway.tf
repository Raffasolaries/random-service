// creates the api gateway
resource "aws_apigatewayv2_api" "lambda" {
 name          = join("-", [var.app_name, "gw"])
 protocol_type = "HTTP"
 body = templatefile("${path.module}/openapi.yml", {
  lambda_arn: aws_lambda_function.main.invoke_arn
 })
}
// creates all the REST API stages (ex. develop,staging,production ...)
resource "aws_apigatewayv2_stage" "lambda" {
 count = length(var.environments)
 api_id = aws_apigatewayv2_api.lambda.id

 name        = element(var.environments, count.index)
 auto_deploy = true

 stage_variables = {
  "lambdaVersion" = element(var.environments, count.index)
 }

 access_log_settings {
  destination_arn = aws_cloudwatch_log_group.api_gw.arn

  format = jsonencode({
    requestId               = "$context.requestId"
    sourceIp                = "$context.identity.sourceIp"
    requestTime             = "$context.requestTime"
    protocol                = "$context.protocol"
    httpMethod              = "$context.httpMethod"
    resourcePath            = "$context.resourcePath"
    routeKey                = "$context.routeKey"
    status                  = "$context.status"
    responseLength          = "$context.responseLength"
    integrationErrorMessage = "$context.integrationErrorMessage"
   }
  )
 }
}
// // binds the api gateway with lambda function
// resource "aws_apigatewayv2_integration" "lambda" {
//  api_id = aws_apigatewayv2_api.lambda.id

//  integration_uri    = aws_lambda_function.main.invoke_arn
//  integration_type   = "AWS_PROXY"
//  integration_method = "POST"
// }
// // creates the main api gateway route to request the defined service
// resource "aws_apigatewayv2_route" "main" {
//  count = length(var.routes)
//  api_id = aws_apigatewayv2_api.lambda.id

//  route_key = join(" ", [var.routes[count.index].method, var.routes[count.index].resource])
//  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
//  // srequest
// }
// creates the CloudWatch logs group to register api gateway accesses
resource "aws_cloudwatch_log_group" "api_gw" {
 name = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"

 retention_in_days = 30
}
// gives api gateway enough permissions to invoke lambda function
resource "aws_lambda_permission" "api_gw" {
 statement_id  = "AllowExecutionFromAPIGateway"
 action        = "lambda:InvokeFunction"
 function_name = aws_lambda_function.main.function_name
 principal     = "apigateway.amazonaws.com"

 source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}