import { Injectable } from '@nestjs/common';
import { RandomDto } from './classes/random-dto';
import { ApigatewayObject } from './classes/apigateway-object';

@Injectable()
export class AppService {
 getRandom(body: RandomDto): ApigatewayObject {
  let statusCode = 200;
  let responseBody = {};
  let items: number[] = [];
  let percentageValue = 0;
  let remaining = body.total;
  if (body.total < body.clusters) {
   statusCode = 500;
   responseBody = {
    message: 'Validation Errors: instance.total must be greater than or equal to instance.clusters'
   }
   return {
    statusCode: statusCode,
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(responseBody)
   }
  }
  if (body.total === body.clusters) {
   statusCode = 200;
   responseBody = {
    items: items
   }
   return {
    statusCode: statusCode,
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(responseBody)
   };
  }
  if (body.minPercentage) {
   if (body.minPercentage * body.clusters > 100) {
    statusCode = 500;
    responseBody = {
     message: 'Validation Errors: instance.minPercentage should permit consistent distribution over all clusters'
    }
    return {
     statusCode: statusCode,
     headers: {
      'Content-Type': 'application/json',
     },
     body: JSON.stringify(responseBody)
    };
   }
   percentageValue = Math.round(parseFloat(((body.total*body.minPercentage)/100).toFixed(3)));
   remaining = body.total-(percentageValue * body.clusters);
   for (let i=0;i<body.clusters;i++) {
    items.push(percentageValue);
   }
  } else {
   remaining = body.total-body.clusters;
   for (let i=0;i<body.clusters;i++) {
    items.push(1);
   }
  }

  for (let i=0;i<body.clusters;i++) {
   if (i === body.clusters-1) {
    items[i] += remaining;
   } else {
    let randomGenerated = Math.floor(Math.random() * remaining);
    items[i] += randomGenerated;
    remaining -= randomGenerated;
   }
  }
  responseBody = {
   items: items
  }
  return {
   statusCode: statusCode,
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify(responseBody)
  };
 }
}
