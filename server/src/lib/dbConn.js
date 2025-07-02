import mongoose from "mongoose";

export const connectMONGO = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB: ${connect.connection.host}`);
  } catch (e) {
    console.error("Error connecting to MongoDB", e);
    process.exit(1);
  }
};
