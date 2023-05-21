import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

// importing types
import { IUser, IUserModel } from "./helpers/types";

// import event emitter
import { UserEvents } from "./helpers/userEventsHandler";

export const userSchema: Schema<IUser> = new Schema<IUser>({
    _id: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
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
        required: true,
        trim: true,
        validate: /^\d{10}$/,
    },
    country: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        validate: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    dateOfBirth: {
        type: Date,
        required: true,
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

/**
 * @Methods to be used on the user model
 */

// Authenticate the user
userSchema.methods.authentication = async function (
    password: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

// Encrypt the password
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

// Update the user
userSchema.methods.updateUser = async function (
    this: IUser,
    updateProps: Partial<IUser>
): Promise<IUser> {
    let userToUpdate: any = this;

    // What are the fields that we want to exculde being updated?
    const protectedFields: Array<keyof IUser> = [
        "_id",
        "stripeId",
        "created_at",
        "updated_at",
    ];

    Object.keys(updateProps).forEach((key: string) => {
        const userKey = key as keyof IUser;

        // Only update the field if it's not a protected field
        if (
            !protectedFields.includes(userKey) &&
            updateProps[userKey] !== undefined
        ) {
            userToUpdate[userKey] = updateProps[userKey];
        }
    });

    // Update the updated_at field
    userToUpdate.updated_at = new Date();

    // Save and return the user
    return await (userToUpdate as IUser).save();
};

/**
 * @Static_Methods to be used on the user model
 */

// Fetch all the users
userSchema.statics.fetchUsers = async function (queryParams) {
    const { first_name, email, created_at_before, created_at_after, is_admin } =
        queryParams;

    const query: any = {};

    if (first_name) query.firstName = { $regex: first_name, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };
    if (created_at_before)
        query.created_at = { ...query.created_at, $lte: created_at_before };
    if (created_at_after)
        query.created_at = { ...query.created_at, $gte: created_at_after };
    if (is_admin !== undefined) query.is_admin = is_admin;

    const users: IUser[] = await this.find(query, {
        password: 0,
        __v: 0,
    }).exec();

    return users;
};

// Create a new user
userSchema.statics.createUser = async function (userData) {
    const userExists = await this.findOne({ email: userData.email });

    if (userExists) {
        throw new Error("User already exists");
    }

    const user = new this(userData);

    await user.save();

    // Emit event for creating stripe customer
    UserEvents.emit("user.created", user);

    // Create a new object to exclude the password and __v
    const { password, __v, ...userObj } = user.toObject();

    return userObj;
};

// Delete an existing user
userSchema.statics.deleteUser = async function (userId: string) {
    const result = await this.deleteOne({ _id: userId }).exec();

    if (result.deletedCount === 0) return false;

    UserEvents.emit("user.deleted", userId);
    return true;
};

/**
 * @Hooks to be used on the user model
 */
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

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
