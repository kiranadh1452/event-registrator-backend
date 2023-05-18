import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../config/firebase.json";

export const initializeFirebase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
};

/**
 * description: Create user in Firebase
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
export const createUserInFirebase = async (email: string, password: string) => {
    // Create user in Firebase
    const userRecord = await admin.auth().createUser({
        email,
        password,
    });

    return userRecord;
};

/**
 * description: Check if the token is valid
 * @param {string} idToken - User's token
 */
export const checkFirebaseToken = async (idToken: string) => {
    try {
        const decodedToken = await admin
            .auth()
            .verifyIdToken(idToken as string);

        return decodedToken;
    } catch (error) {
        return false;
    }
};

/**
 * description: Delete user from Firebase
 * @param {string} id - User's id
 */
export const deleteUser = async (id: string) => {
    try {
        await admin.auth().deleteUser(id);
    } catch (error) {
        throw error;
    }
};
