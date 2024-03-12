import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(`mongodb+srv://matheusfff02:${process.env.MONGO_PASSWORD}@instacemongointerconsul.1gfrhkw.mongodb.net/`);
    const db = mongoose.connection;
    db.once("open", () => {
      console.log("MongoDB connected");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

export default {
  connect,
};


MONGO_PASSWORD=030503Aa
