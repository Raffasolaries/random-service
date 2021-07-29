module.exports.handler = async (event, context) => {
 console.log('Event: ', event, 'Context', context);
 let responseMessage = 'Hello, World!';

 return {
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: responseMessage,
  })
 }
}