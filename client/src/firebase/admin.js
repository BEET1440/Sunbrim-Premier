import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "./config";

/**
 * Check if the current user has admin privileges
 * @returns {Promise<boolean>}
 */
export const isAdmin = async () => {
  const user = auth.currentUser;
  
  if (!user) return false;

  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.role === 'admin';
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Higher-order function to wrap around components or logic that require admin access
 * @param {function} callback - Function to run if admin
 */
export const runAsAdmin = async (callback) => {
  const adminStatus = await isAdmin();
  
  if (adminStatus) {
    return callback();
  } else {
    throw new Error("Unauthorized access. Admin privileges required.");
  }
};
