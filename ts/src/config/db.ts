import mongoose, { Connection, Mongoose } from "mongoose";

let connection: Mongoose;

const connectDB = async (): Promise<void> => {
    try {
        const url =
            process.env.MODE === "dev"
                ? (process.env.MONGO_URI_OFFLINE as string)
                : (process.env.MONGO_URI_ONLINE as string);

        connection = await mongoose.connect(url);
        console.log(
            `Connected to database with host: ${connection.connection.host} and name: ${connection.connection.name}`
        );
    } catch (err: any) {
        throw new Error("Error while connecting to database : " + err.message);
    }
};

export const closeDB = async (): Promise<void> => {
    try {
        await connection.disconnect();
        console.log("Disconnected from database");
    } catch (err: any) {
        throw new Error(
            "Error while disconnecting from database : " + err.message
        );
    }
};

export default connectDB;
