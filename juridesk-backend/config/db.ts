import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();


const connectDB = async():Promise<void>=>{
    try {
        const mongoUri=process.env.MONGO_URI;
        const dbName=process.env.DB_NAME;

        if(!mongoUri){
            throw new Error("Mongo_URI is not defined in enviroment variables") 
        }

        const conn =await mongoose.connect(mongoUri,{
            dbName:dbName
        });
        console.log("DataBase connected successfully");
    }
    catch(error){
        console.error(error);
        process.exit(1)
    }
}

export default connectDB;