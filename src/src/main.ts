import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as YAML from 'json-to-pretty-yaml';
import { AppModule } from './app.module';

export async function createApp(expressApp: Express): Promise<INestApplication> {
 const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
 const config = new DocumentBuilder()
  .setTitle('Random Service')
  .setDescription('Distributes random numbers over a set of clusters')
  .setVersion('1.0.0')
  .addTag('random')
  .build();
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, document);
 const outputPath = path.resolve('../', 'openapi.yml');
 document['x-amazon-apigateway-request-validator'] = 'all';
 document['x-amazon-apigateway-request-validators'] = {
  'all': {
   validateRequestBody: true,
   validateRequestParameters: true
  },
  'body-only': {
   validateRequestBody: true,
   validateRequestParameters: false
  },
  'params-only': {
   validateRequestBody: false,
   validateRequestParameters: true
  }
 };
 document.components['x-amazon-apigateway-integrations'] = {
  distribution: {
   uri: '${lambda_arn}',
   passthroughBehavior: 'never',
   httpMethod: 'POST',
   type: 'aws_proxy',
   payloadFormatVersion: '2.0'
  }
 };
 // console.log('document', JSON.stringify(document));
 // console.log('document', YAML.stringify(document));
 // console.log('resolved path', outputPath);
 await fs.promises.writeFile(outputPath, YAML.stringify(document));
 return app;
}