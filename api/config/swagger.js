import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vitta API',
      version: '1.0.0',
      description: 'API documentation for the Vitta scheduling system',
    },
    servers: [
      {
        url: '/api',
        description: 'Production Server (via Reverse Proxy)'
      },
      {
        url: 'http://localhost:3000',
        description: 'Local Development'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs relative to where server.js is run
};

export const specs = swaggerJsdoc(options);
