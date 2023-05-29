import mongoose from "mongoose";

const dropDatabase = async (databaseURL: string): Promise<void> => {
    try {
        await mongoose.connect(databaseURL);
        console.log("Connected to the database");

        await mongoose.connection.db.dropDatabase();
        console.log("Database dropped successfully");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
    }
};

export default dropDatabase;
