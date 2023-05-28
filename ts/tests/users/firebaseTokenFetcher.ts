import axios from "axios";

const generateToken = async (email: string, password: string) => {
    try {
        const firebaseAuthURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;

        const response = await axios.post(firebaseAuthURL, {
            email,
            password,
            returnSecureToken: true,
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export default generateToken;
