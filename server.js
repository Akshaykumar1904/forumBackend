import express from 'express';
/*
BASIC-CONFIG-IMPORTS!
*/
import dotenv from 'dotenv';
import connectDb from './Backend/config/db.config.js';
/*
ROUTING-IMPORTS!
*/
import userRoutes from './Backend/Routes/user.route.js';
import postRoutes from './Backend/Routes/post.route.js';
import likeRoutes from './Backend/Routes/like.route.js';
import commentRoutes from './Backend/Routes/comment.routes.js';
/*
ERROR-HANDLING-IMPORTS!
*/
import { errorHandler } from './Backend/middlewares/validation.middleware.js';
import { globalErrorHandler } from './Backend/middlewares/error.middleware.js';
import { NotFoundError } from './Backend/utils/customError.js';

/*
DOCUMENTATION-IMPORTS!
*/
import { swaggerUi, specs } from './Backend/config/swagger.config.js';
import cors from 'cors';

/*
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
*/

/*
for NoSQL injection and XSS security
*/
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';


// load the environment variables
dotenv.config();
// connect DATABASE-MONGO_DB
connectDb();
// create app using express 
const app = express();
// define port & default_port 
const PORT = process.env.PORT || 4000;

// Basic security first
app.use(helmet());                // Secure HTTP headers
app.use(mongoSanitize());        //  Prevent NoSQL injection
app.use(cors());                 // Enable CORS

// Parsing incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validation-related middleware early
app.use(errorHandler);           // Your input validator error handler

/*
Documentation routes (before API routes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
    .swagger-ui .scheme-container { background: #1f2937; border-radius: 8px; }
  `,
  customSiteTitle: "Forum API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
  }
}));
*/

// Modern Scalar Documentation
app.get('/docs', (req, res) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Forum API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzEwYjk4MSIvPgo8cGF0aCBkPSJNMTYgOEwxNiAyNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTggMTZMMjQgMTYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=" />
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
    </style>
</head>
<body>
    <script
        id="api-reference"
        type="application/json"
        data-configuration='{
            "theme": "purple",
            "layout": "modern",
            "showSidebar": true,
            "hideDownloadButton": false,
            "searchHotKey": "k",
            "darkMode": false,
            "customCss": "--scalar-color-1: #10b981; --scalar-color-2: #059669; --scalar-color-3: #047857;",
            "metaData": {
                "title": "Forum API Documentation",
                "description": "Professional backend API documentation",
                "ogDescription": "A comprehensive forum API built with Node.js, Express, and MongoDB"
            }
        }'>${JSON.stringify(specs)}</script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest"></script>
</body>
</html>`;
  res.send(html);
});

/*
// Redoc Documentation
app.get('/redoc', (req, res) => {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Forum API Documentation</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; }
    </style>
</head>
<body>
    <redoc spec-url='/api/openapi.json' theme='{
        "colors": {
            "primary": {
                "main": "#10b981"
            }
        },
        "typography": {
            "fontSize": "16px",
            "fontFamily": "Roboto, sans-serif",
            "headings": {
                "fontFamily": "Montserrat, sans-serif"
            }
        }
    }'></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>
</body>
</html>`;
  res.send(html);
});

*/

// Serve OpenAPI JSON
app.get('/api/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Documentation redirects
app.get('/documentation', (req, res) => {
  res.redirect('/docs');
});


//  userRH
app.use('/forum/api/auth', userRoutes);

// postRH
app.use('/forum/api/post', postRoutes);

// likeRH
app.use('/forum/api/like', likeRoutes)

// commentRH
app.use('/forum/api/comment', commentRoutes);

// app.all('*', (req, res, next) => {
//   next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
// });


app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation available at:`);
  // console.log(`   - Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`   - Scalar UI: http://localhost:${PORT}/docs`);
  // console.log(`   - Redoc UI: http://localhost:${PORT}/redoc`);
});


export default app;

