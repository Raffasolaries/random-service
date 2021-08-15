// // .zip Node.js application bucket -> code to deliver to lamda function 
// resource "aws_s3_bucket" "lambda_bucket" {
//  bucket = var.app_name

//  acl           = "private"
//  force_destroy = true

//  logging {
//   target_bucket = aws_s3_bucket.access_logs_bucket.id
//   target_prefix = "log/"
//  }

//  versioning {
//   enabled = true
//  }

//  lifecycle_rule {
//   id      = "dismissed-versions"
//   enabled = true

//   transition {
//    days          = 30
//    storage_class = "ONEZONE_IA"
//   }

//   transition {
//    days          = 60
//    storage_class = "GLACIER"
//   }

//   expiration {
//    days = 90
//   }
//  }

//  server_side_encryption_configuration {
//   rule {
//    apply_server_side_encryption_by_default {
//     sse_algorithm = "AES256"
//    }
//   }
//  }

//  tags = {
//   Name = join("-", [var.app_name, "bucket"])
//  }
// }
// // server access logs bucket containing lambda .zip code
// resource "aws_s3_bucket" "access_logs_bucket" {
//  bucket = join("-", ["logs", var.app_name, "bucket"])

//  acl           = "log-delivery-write"
//  force_destroy = true

//  lifecycle_rule {
//   id      = "log"
//   enabled = true

//   prefix = "log/"

//   tags = {
//    rule      = "log"
//    autoclean = "true"
//   }

//   transition {
//    days          = 30
//    storage_class = "ONEZONE_IA"
//   }

//   transition {
//    days          = 60
//    storage_class = "GLACIER"
//   }

//   expiration {
//    days = 90
//   }
//  }

//  server_side_encryption_configuration {
//   rule {
//    apply_server_side_encryption_by_default {
//     sse_algorithm = "AES256"
//    }
//   }
//  }

//  // grant {
//  //  type        = "Group"
//  //  permissions = ["READ_ACP", "WRITE"]
//  //  uri         = "http://acs.amazonaws.com/groups/s3/LogDelivery"
//  // }

//  tags = {
//   Name = join("-", ["logs", var.app_name, "bucket"])
//  }
// }
// // archive file taken from repo excluding node modules
// data "archive_file" "lambda_radom_service" {
//  type = "zip"

//  source_dir  = "${path.module}/src"
//  output_path = "${path.module}/random-service.zip"

//  excludes    = [ "${path.module}/src/node_modules" ]
// }
// # node_modules zip
// data "archive_file" "node_modules" {
//  type = "zip"

//  source_dir  = "${path.module}/src/node_modules"
//  output_path = "${path.module}/node_modules.zip"
// }
// // actual lambda code object
// resource "aws_s3_bucket_object" "lambda_object" {
//  bucket = aws_s3_bucket.lambda_bucket.id

//  key    = "random-service.zip"
//  source = data.archive_file.lambda_radom_service.output_path

//  etag = data.archive_file.lambda_radom_service.output_base64sha256
//  // etag = filemd5(data.archive_file.lambda_radom_service.output_path)
// }