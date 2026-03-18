# Troubleshooting

This guide provides solutions to common issues you might encounter while setting up or using the Sunbrim Premier system.

## Common Issues & Resolutions

### 1. M-Pesa STK Push Not Triggering
- **Check Configuration**: Ensure that the M-Pesa API credentials (Consumer Key, Consumer Secret, Passkey, Shortcode) are set correctly in the Cloud Functions config.
- **Verify Phone Number**: Ensure the customer's phone number is in the `254XXXXXXXXX` format.
- **Test in Sandbox**: Use a test phone number and verification code to test the STK Push in the Safaricom sandbox.
- **Check Cloud Function Logs**: Inspect the logs in the Firebase Console for any error messages.

### 2. Payment Status Not Updating
- **Verify Callback URL**: Ensure the M-Pesa Callback URL is configured correctly in the Cloud Functions config.
- **Check Webhook Payload**: Ensure the callback payload from Safaricom is valid and includes the correct `MerchantRequestID` and `CheckoutRequestID`.
- **Verify Order Reference**: Ensure the order reference in the callback matches the one stored in Firestore.
- **Check Cloud Function Logs**: Inspect the logs in the Firebase Console for any errors during the callback processing.

### 3. User Authentication Issues
- **Verify Phone Auth Provider**: Ensure that the Phone Number sign-in provider is enabled in the Firebase Console.
- **Check Test Phone Numbers**: Ensure that test phone numbers and verification codes are set correctly in the Firebase Console.
- **Check Recaptcha Verifier**: Ensure that the Recaptcha Verifier is initialized correctly on the frontend.
- **Check Firebase SDK Version**: Ensure you are using a compatible version of the Firebase SDK on the frontend.

### 4. Database Query Errors
- **Verify Firestore Rules**: Ensure that the Firestore rules allow authenticated users to read and write to the `orders` collection.
- **Check Firestore Indexing**: Ensure that the required indexes for querying orders by `phoneNumber` and `createdAt` are created in the Firebase Console.
- **Check Query Parameters**: Ensure that the query parameters (e.g., `phoneNumber`) are in the correct format.

## Support & Resources
- **Firebase Documentation**: [https://firebase.google.com/docs](https://firebase.google.com/docs)
- **Safaricom Daraja API Documentation**: [https://developer.safaricom.co.ke/docs](https://developer.safaricom.co.ke/docs)
- **React Documentation**: [https://reactjs.org/docs](https://reactjs.org/docs)
- **Tailwind CSS Documentation**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

---
[Back to Home](Home)
