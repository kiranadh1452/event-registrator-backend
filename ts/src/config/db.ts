import mongoose, { Connection } from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const url =
            process.env.MODE === "dev"
                ? (process.env.MONGO_URI_OFFLINE as string)
                : (process.env.MONGO_URI_ONLINE as string);

        const connection = await mongoose.connect(url);
        console.log(
            `Connected to database with host: ${connection.connection.host} and name: ${connection.connection.name}`
        );
    } catch (err: any) {
        console.error(err);
    }
};

export default connectDB;
