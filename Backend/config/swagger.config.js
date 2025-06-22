import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Forum Backend Api',
      version: '1.0.0',
      description: 'A comprehensive backend documentation for understanding different routes and models used!',
      contact: {
        name: 'Akshay kumar',
        email: 'akshay.1904@gmail.com'
      }
    },
    servers: [
      {
        url: 'https://localhost:4000/api',
        description: 'Devlopment Server!'
      }
    ],
    components: {
      securityShemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              examples: '507f1f77bcf86cd799439011'
            },
            username: {
              type: 'string',
              example: 'akshay'
            },
            email: {
              type: 'string',
              example: 'akshay.something@gmail.com'
            },
            createdAt: {
              type: 'string',
              example: 'date-time'
            }
          }
        },
        Post: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              example: 'My post'
            },
            content: {
              type: 'string',
              example: 'This is content related to my post'
            },
            author: {
              $ref: '#/components/user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            content:{
              type:'string',
              example:'Comment on the post'
            },
            author:{
              $ref:'#/components/comment'
            },
            post:{
              type:'string',
              example:'507f1f77bcf86cd799439011'
            },
            createdAt:{
              type:'string',
              example:'date-time'
            }
          }
        },
        ApiResponse:{
          type:'object',
          properties:{
            success:{
              type:'boolean',
              example:true
            },
            message:{
              type:'string',
              example:'operation successfull'
            },
            data:{
              type:'object'
            }
          }
        },
        Error:{
          type:'object',
          properties:{
            success:{
              type:'boolean',
              example:false
            },
            message:{
              type:'string',
              example:'an error occurred'
            },
            errors:{
              type:'array',
              items:{
                type:'object'
              }
            }
          }
        }
      },
      routes:{
        
      }
    }
  },
  apis:['./Routes/*.js']
}

const specs = swaggerJsdoc(options);
export{
  specs,
  swaggerUi
}