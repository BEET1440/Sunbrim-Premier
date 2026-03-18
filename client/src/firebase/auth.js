import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth } from "./config";

/**
 * Initialize ReCaptcha Verifier
 * @param {string} containerId - The ID of the HTML element to render the ReCaptcha
 */
export const initRecaptcha = (containerId) => {
  if (window.recaptchaVerifier) return window.recaptchaVerifier;

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      console.log("Recaptcha solved successfully");
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.log("Recaptcha expired, please try again.");
    }
  });

  return window.recaptchaVerifier;
};

/**
 * Send OTP to the provided phone number
 * @param {string} phoneNumber - Format: +2547XXXXXXXX
 * @param {object} appVerifier - ReCaptcha verifier instance
 */
export const sendOtp = async (phoneNumber, appVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return { success: true, confirmationResult };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Confirm OTP and sign in
 * @param {object} confirmationResult - The result from sendOtp
 * @param {string} code - The 6-digit OTP code
 */
export const verifyOtp = async (confirmationResult, code) => {
  try {
    const result = await confirmationResult.confirm(code);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out the current user
 */
export const logOut = () => signOut(auth);

/**
 * Listen for auth state changes
 * @param {function} callback - Function to run when auth state changes
 */
export const subscribeToAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};
