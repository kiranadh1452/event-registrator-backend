import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const url =
            process.env.MODE == "dev"
                ? process.env.MONGO_URI_OFFLINE
                : process.env.MONGO_URI_ONLINE;
        await mongoose
            .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .then((data) => {
                console.log(
                    "Connected to database with host:" +
                        `${data?.connection?.host} and name: ${data?.connection?.name}`
                );
            });
    } catch (err) {
        console.log(err);
    }
};

export default connectDB;
