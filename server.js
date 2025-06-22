/*
```About Routes```
userRH --> userRoutesHandling
postRH -->postRoutesHandling
likeRH -->likesRoutesHandling
*/


import express from 'express';
import dotenv from 'dotenv';
import connectDb from './Backend/config/db.config.js';
import userRoutes from './Backend/Routes/user.route.js';
import postRoutes from './Backend/Routes/post.route.js';
import likeRoutes from './Backend/Routes/like.route.js';
import commentRoutes from './Backend/Routes/comment.routes.js';
import { errorHandler } from './Backend/middlewares/validation.middleware.js';
import { swaggerUi,specs } from './Backend/config/swagger.config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load the environment variables
dotenv.config();
// connect DATABASE-MONGO_DB
connectDb();
// create app using express 
const app = express();
// define port & default_port 
const PORT = process.env.PORT || 4000;


app.use(errorHandler);

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation routes (before API routes)
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

// Serve OpenAPI JSON
app.get('/api/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Documentation redirects
app.get('/documentation', (req, res) => {
  res.redirect('/docs');
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: "Forum API is running!",
    documentation: {
      swagger: `http://localhost:${PORT}/api-docs`,
      scalar: `http://localhost:${PORT}/docs`,
      redoc: `http://localhost:${PORT}/redoc`
    },
    version: "1.0.0"
  });
});
// 
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation available at:`);
  console.log(`   - Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`   - Scalar UI: http://localhost:${PORT}/docs`);
  console.log(`   - Redoc UI: http://localhost:${PORT}/redoc`);
});


// console.log('API Documentation available at: http://localhost:4000/api/docs');

//  userRH
app.use('/forum/api/auth',userRoutes);

// postRH
app.use('/forum/api/post',postRoutes);

// likeRH
app.use('/forum/api/like',likeRoutes)

// commentRH
app.use('/forum/api/comment',commentRoutes);

// for verfication purpose
app.get('/',(req,res)=>{
  res.json({
    message:"working backend,see console now!!!!!"
  })
  console.log("its working,thanks")
});


// to listen all requests made by user on routes 
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

export default app;

