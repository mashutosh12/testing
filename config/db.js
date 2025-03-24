import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://yashmishra77738:${process.env.MONGODB_PASSWORD}@strirakshacluster.z0jfh.mongodb.net/?retryWrites=true&w=majority&appName=striRakshaCluster`
);
console.log("MongoDB Connected Successfully!");
  }catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    process.exit(1); 
  }
};
 
export default connectDB;