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

// load the environment variables
dotenv.config();
// connect DATABASE-MONGO_DB
connectDb();
// create app using express 
const app = express();
// define port & default_port 
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(errorHandler);

app.use('/api/docs',swaggerUi.serve,swaggerUi.setup(specs,{
  explorer:true,
  customCss:'.swagger-ui .topbar{display:none}',
  customSiteTitle:"Forum discussion backend Docs"
}))


console.log('API Documentation available at: http://localhost:4000/api/docs');

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

