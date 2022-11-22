import mongoose from "mongoose";

export async function connectToDb() {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined!');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Mongo Db');

}