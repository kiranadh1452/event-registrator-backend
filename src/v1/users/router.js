import express from "express";

// Importing the event controllers
import {
    loginUser,
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
} from "./controller.js";

const router = express.Router();

// Define the event routes here
router.get("/test", (req, res) => {
    return res.status(200).json({
        code: 200,
        message: "Success",
        data: "Test endpoint - Users",
    });
});

// Get all users
router.get("/", getAllUsers);

// Create a new user
router.post("/", createUser);

// Get a specific user by ID
router.get("/:id", getUserById);

// Update a specific user by ID
router.put("/:id", updateUserById);

// Delete a specific user by ID
router.delete("/:id", deleteUserById);

// login user
router.post("/login", loginUser);

export default router;
