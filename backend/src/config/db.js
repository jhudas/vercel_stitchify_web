import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stitchify');
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ Database Connection Failed:", err.message);
        process.exit(1);
    }
};

export default connectDB;