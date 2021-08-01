# Random Service

Sample Random numbers infrastructure with latest AWS API Gateway2 + Lambda function - everything deployed with terraform

## Requirements

[aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
[terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)<br>
[nodejs](https://nodejs.org/it/download/current/)

## Run

<p>It's possibile to run tests inside the code root: `random-service` launching form cli: `npm run test`.<br>
To deploy the stack, you must have an AWS profile with enough permissions for CloudWatch Logs, Lambda, API Gateway, IAM roles.<br>
Before lanching the command `terraform init` from CLI, I advice to use a `terraform.tfvars` configured file; thus the deployment process is fluid.<br>
Here is a `terraform.tfvars` example:<br></p>

```bash
echo 'region = "eu-south-1"
profile = "default"
environments = ["develop"]
app_name = "stillfront-random-service"
routes = [{
 "model": "Distribution", 
 "method": "POST",
 "resource": "/distribution"
}]' >> terraform.tfvars
```

<p>The profile variable refers to local aws cli profile with `aws_access_key_id` and `aws_secret_access_key` already set.<br>
If you run the bash command `cat ~/aws/credentials`, it would return the set of profile name(s) with credentials<br>
example output:<br>
[default]
aws_access_key_id = *your access key id*
aws_secret_access_key = *your secret key*</p>

### Deployment

<p>After the initial setup, it's possible to deploy and test the stack.</p>

```bash
terraform init
terraform plan
terraform apply -auto-approve
```

<p>Grab the output baseurls endpoint and enjoy testing it :)<p>

```bash
curl --location --request POST '<baseurl>/distribution' \
--header 'Content-Type: application/json' \
--data-raw '{ 
  "total": 2000,
  "clusters": 15,
  "minPercentage": 4
}'
```

## Terraform architecture

### Providers

| Name | Version |
|------|---------|
| <a name="provider_archive"></a> [archive](#provider\_archive) | 2.2.0 |
| <a name="provider_aws"></a> [aws](#provider\_aws) | 3.51.0 |

### Modules

No modules.

### Resources

| Name | Type |
|------|------|
| [aws_apigatewayv2_api.lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_api) | resource |
| [aws_apigatewayv2_stage.lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/apigatewayv2_stage) | resource |
| [aws_cloudwatch_log_group.api_gw](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_log_group.lambda_group](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_iam_role.lambda_exec](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.lambda_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_lambda_function.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_permission.api_gw](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |
| [aws_s3_bucket.access_logs_bucket](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket.lambda_bucket](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_object.lambda_object](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_object) | resource |
| [archive_file.lambda_radom_service](https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file) | data source |

### Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_app_name"></a> [app\_name](#input\_app\_name) | Application name | `string` | n/a | yes |
| <a name="input_environments"></a> [environments](#input\_environments) | referral environments | `list` | n/a | yes |
| <a name="input_profile"></a> [profile](#input\_profile) | AWS IAM user credentials | `string` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | AWS deployment region | `string` | `"eu-south-1"` | no |
| <a name="input_routes"></a> [routes](#input\_routes) | Available routes to send requests to | <pre>list(object({<br>  method = string<br>  resource = string<br>  model = string<br> }))</pre> | n/a | yes |

### Outputs

| Name | Description |
|------|-------------|
| <a name="output_base_urls"></a> [base\_urls](#output\_base\_urls) | Base URLs for API Gateway stages. |
| <a name="output_function_name"></a> [function\_name](#output\_function\_name) | Name of the Lambda function. |
| <a name="output_lambda_bucket_name"></a> [lambda\_bucket\_name](#output\_lambda\_bucket\_name) | Name of the S3 bucket used to store function code. |