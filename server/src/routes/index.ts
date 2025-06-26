import express, { Router } from 'express';
import projectRoutes from './project.route';
import adminRoutes from './admin.routes';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const router: Router = express.Router();

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StakeStream API',
      version: '1.0.0',
      description: 'Umi-Powered Project Staking Platform API',
      contact: {
        name: 'StakeStream Team'
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
router.use('/projects', projectRoutes);
router.use('/admin', adminRoutes);

// Swagger documentation route
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API info route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to StakeStream API',
    documentation: '/api/docs',
    version: '1.0.0'
  });
});

export default router;
