import { firebaseDb } from "../config/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function loginUser(username: string, password: string): Promise<{ success: boolean; isAdmin?: boolean; error?: string }> {
    try {
        const usersRef = collection(firebaseDb, "users");
        const q = query(usersRef, where("name", "==", username), where("password", "==", password));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0].data();

            localStorage.setItem("user", JSON.stringify(user));
            
            return { success: true, isAdmin: user.isAdmin };
        } else {
            return { success: false, error: "Invalid username or password" };
        }
    } catch (error) {
        return { success: false, error: "An error occurred during login" };
    }
}
