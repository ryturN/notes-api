import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notes API',
            version: '1.0.0',
            description: 'API documentation for the application',
        }
    },
    apis: ['./app/routes/*.ts', './app/docs/*.yaml'],
}

const specs = swaggerJsdoc(options);

export default (app: Express) => {
    app.use ('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
}