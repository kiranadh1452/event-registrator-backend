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
