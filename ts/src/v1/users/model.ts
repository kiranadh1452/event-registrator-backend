import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    stripeId?: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    country?: string;
    address?: string;
    zip_code?: string;
    password: string;
    is_admin: boolean;
    dateOfBirth?: string;
    created_at: Date;
    updated_at: Date;
    authentication(password: string): Promise<boolean>;
    encryptPasswordFunction(password: string): Promise<string>;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
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
userSchema.methods.authentication = async function (
    password: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

userSchema.methods.encryptPasswordFunction = async function (
    password: string
): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw error;
    }
};

// Hooks to be used on the user model
userSchema.pre("save", async function (this, next: (err?: Error) => void) {
    const user = this;

    // Hash the password before saving it
    if (user.isModified("password")) {
        user.password = await user.encryptPasswordFunction(user.password);
    }

    // Update the updated_at field
    user.updated_at = new Date();

    next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
