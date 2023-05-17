import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    stripeId: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        index: "text",
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        index: "text",
    },
    phoneNumber: {
        type: String,
        trim: true,
        validate: /^\d{10}$/,
    },
    country: {
        type: String,
    },
    address: {
        type: String,
        required: false,
        trim: true,
    },
    zip_code: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        validate: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    },
    is_admin: {
        type: Boolean,
        default: false,
    },
    dateOfBirth: {
        type: String,
        required: false,
        trim: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

// Methods to be used on the user model
userSchema.methods = {
    authentication: async function (password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            throw error;
        }
    },
    encryptPasswordFunction: async function (password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (error) {
            throw error;
        }
    },
};

// Hooks to be used on the user model
userSchema.pre("save", async function (next) {
    const user = this;

    // Hash the password before saving it
    if (user.isModified("password")) {
        user.password = await user.encryptPasswordFunction(user.password);
    }

    // Update the updated_at field
    user.updated_at = new Date();

    next();
});

const User = mongoose.model("User", userSchema);

export default User;
