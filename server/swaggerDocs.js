// user swagger to generate api docuemmnts and create a interface that can test the api

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const docsRouter = require('express').Router();

module.exports = docsRouter;

//https://www.npmjs.com/package/swagger-jsdoc
//configuration

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'Personal-Budget API',
          version: '1.0.0',
          description: 'Budget management tool'
        },
        servers: [
          {
             url:'https://personal-budget-z.herokuapp.com',
          }
        ]
      },
    apis: ['./server/envelopes.js', './server/transactions.js'], // files containing annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
//use swaggerUi module to serve the swaggerdocs above 
docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

