import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    _id: string;
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
    updateUser: (this: IUser, updateProps: Partial<IUser>) => Promise<IUser>;
}

// This tells typescript that we want to add static methods to the user model
export interface IUserModel extends Model<IUser> {
    fetchUsers(queryParams: any): Promise<IUser[]>;
    createUser(userData: any): Promise<IUser>;
    deleteUser(userId: string): Promise<IUser>;
}
