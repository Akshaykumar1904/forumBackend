/*
```About Routes```
userRH --> userRoutesHandling

*/


import express from 'express';
import dotenv from 'dotenv';
import connectDb from './Backend/config/db.config.js';
import userRoutes from './Backend/Routes/user.route.js';
import postRoutes from './Backend/Routes/post.route.js';


// load the environment variables
dotenv.config();
// connect DATABASE-MONGO_DB
connectDb();
// create app using express 
const app = express();
// define port & default_port 
const PORT = process.env.PORT || 4000;

app.use(express.json());

// #region userRH
app.use('/forum/api/auth',userRoutes);
app.use('/forum/api/post',postRoutes);

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

