import mongoose from "mongoose";

const connectDb = async () => {
    mongoose.connection.on("connected", () => {
        console.log("mongodb connected");
    });
    await mongoose.connect(process.env.MONGODB_URI as string);
};

export default connectDb;
