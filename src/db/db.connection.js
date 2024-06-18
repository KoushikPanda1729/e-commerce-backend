import mongoose from "mongoose";
import { DB_NAME } from "./../constant.js";

const databaseConnection = async () => {
  try {
    const databaseResponse = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(databaseResponse.connection.host);
  } catch (error) {
    console.log("Database connection error ", error);
    process.exit(1);
  }
};

export default databaseConnection;
