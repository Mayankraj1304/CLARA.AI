import mongoose from "mongoose";

const connectToDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB has been successfully connected`);
};

export default connectToDB;