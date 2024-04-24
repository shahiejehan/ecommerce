import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

function connDB() {
    try {
        const URL = process.env.MONGO_URL;
        mongoose.connect(URL);
        console.log("connected to db server...".bgWhite.black);
    } catch (error) {
        console.log("error in connecting db server", error);
    }
}

export default connDB;