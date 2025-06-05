import express from 'express';
import dotenv from 'dotenv';
import connectDb from './Backend/config/db.config.js';
import userRoutes from './Backend/Routes/user.route.js';

dotenv.config();

connectDb();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/auth',userRoutes);

app.get('/',(req,res)=>{
  res.json({
    message:"working backend,see console now!!!!!"
  })
  console.log("its working,thanks")
});



app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

