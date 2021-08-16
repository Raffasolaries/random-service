module.exports.handler = async (event, context) => {
 console.log('Event: ', event);
 console.log('Context', context);
 const Validator = require('jsonschema').Validator;
 const v = new Validator();
 const bodySchema = {
  id: '/bodySchema',
  type: 'object',
  properties: {
   total: { type: 'integer', minimum: 1 },
   clusters: { type: 'integer', minimum: 1 },
   minPercentage: { type: 'number', maximum: 100 }
  },
  required: ['total', 'clusters']
 };
 // v.addSchema(bodySchema, '/bodySchema')
 const returnMapping = (statusCode, responseBody) => {
  return {
   statusCode: statusCode,
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify(responseBody)
  }
 }
 const body = JSON.parse(event.body) ? JSON.parse(event.body) : {};
 let statusCode = 200;
 let responseBody = {};
 let items = [];
 let percentageValue = 0;
 let remaining = body.total;
 const validateRes = v.validate(body, bodySchema);
 console.log('validation results', validateRes);
 if (validateRes.errors && validateRes.errors.length > 0) {
  statusCode = 500;
  responseBody = {
   message: 'Validation Errors: '+validateRes.errors.map(error => error.property+' '+error.message).join(', ')
  }
  return returnMapping(statusCode, responseBody);
 }
 if (body.total < body.clusters) {
  statusCode = 500;
  responseBody = {
   message: 'Validation Errors: instance.total must be greater than or equal to instance.clusters'
  }
  return returnMapping(statusCode, responseBody);
 }
 if (body.total === body.clusters) {
  statusCode = 200;
  responseBody = {
   items: items
  }
  return returnMapping(statusCode, responseBody);
 }
 if (body.minPercentage) {
  if (body.minPercentage * body.clusters > 100) {
   statusCode = 500;
   responseBody = {
    message: 'Validation Errors: instance.minPercentage should permit consistent distribution over all clusters'
   }
   return returnMapping(statusCode, responseBody);
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
 return returnMapping(statusCode, responseBody);
}