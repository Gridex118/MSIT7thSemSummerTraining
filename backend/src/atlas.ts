import "dotenv/config";
import mongoose from "mongoose";

export async function connectToMongoDB() {
  const URI = process.env.ATLAS_URI;
  if (!URI) throw new Error("Unable to connect to Atlas");
  await mongoose.connect(URI);
  console.log("You successfully connected to MongoDB!");
}

export async function disconnectFromMongoDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}
