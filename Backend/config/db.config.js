import mongoose from 'mongoose';

const connectDb = async ()=>{
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb is connected :",conn.connection.host);
  } catch (error) {
    console.error("error while connecting db",error.message);
  }
}

export default connectDb;