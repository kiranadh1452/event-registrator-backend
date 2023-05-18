import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../config/firebase.json";

export const initializeFirebase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
};

export const createUserInFirebase = async (email: string, password: string) => {
    // Create user in Firebase
    const userRecord = await admin.auth().createUser({
        email,
        password,
    });

    return userRecord;
};
