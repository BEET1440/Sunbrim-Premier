# Deployment Guide

Sunbrim Premier is designed to be deployed on Firebase Hosting and Cloud Functions for maximum reliability and scalability.

## Deployment Steps

### 1. Build the Frontend
Navigate to the `client` directory and run the build command:
```bash
cd client
npm run build
```
The built assets will be located in the `client/dist` directory.

### 2. Configure Firebase Hosting
If you haven't initialized Firebase Hosting, run:
```bash
firebase init hosting
```
- Select the `client/dist` directory for the public directory.
- Configure as a single-page app (SPA).

### 3. Set Up Cloud Functions
Navigate to the `functions` directory and run the deploy command:
```bash
cd functions
firebase deploy --only functions
```
The Cloud Functions will be deployed to the `europe-west1` region (or your preferred region).

### 4. Deploy to Hosting
Navigate back to the project root and run:
```bash
firebase deploy --only hosting
```
The application will be accessible at the provided `*.web.app` URL.

### 5. Final Checks
- **Test Phone Login**: Ensure that the OTP code is sent and the user is authenticated correctly.
- **Test Order Placement**: Place a test order and verify that the STK Push is triggered.
- **Verify Payment Callback**: Complete a test payment and verify that the order status is updated in Firestore.
- **Check Admin Dashboard**: Verify that the order appears in the Admin Dashboard with the correct status.

## Domain Configuration
If you want to use a custom domain, you can configure it in the Firebase Console under the **Hosting** section.

---
[Next: API Documentation](API-Documentation) | [Back to Home](Home)
