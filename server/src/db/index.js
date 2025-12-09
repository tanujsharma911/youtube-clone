import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config();

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONOGODB_URL + `/${DB_NAME}`);
        console.log('\x1b[32m%s\x1b[0m', "\n💾  Connected to MongoDB :: Database");

    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', "Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectToDB;
