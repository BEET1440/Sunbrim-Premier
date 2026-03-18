# Backend & Firebase Setup

Sunbrim Premier uses Firebase as its backend-as-a-service (BaaS) for data storage, authentication, and serverless logic.

## Firebase Configuration
The backend is located in the `/functions` directory.

```text
/functions
  ├── index.js             # Cloud Functions logic (M-Pesa STK Push and Callback)
  └── package.json         # Backend dependencies
```

## Setup Steps

### 1. Create a Firebase Project
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Create a new project called `Sunbrim-Premier`.
- Enable **Firestore Database**, **Authentication**, and **Cloud Functions**.

### 2. Configure Authentication
- Go to the **Authentication** section.
- Enable **Phone Number** as a sign-in provider.
- Add test phone numbers and verification codes if needed.

### 3. Initialize Firestore Database
- Go to the **Firestore Database** section.
- Create a database in **Production mode**.
- Set up initial rules (e.g., allow authenticated users to read and write to the `orders` collection).

### 4. Configure Firebase CLI
- Install the Firebase CLI: `npm install -g firebase-tools`.
- Log in to your Firebase account: `firebase login`.
- Initialize your project: `firebase init`.
- Select **Firestore**, **Functions**, and **Hosting**.
- Choose your `Sunbrim-Premier` project.

### 5. Set Environment Variables
- Set the M-Pesa API credentials for Cloud Functions:
```bash
firebase functions:config:set mpesa.key="YOUR_KEY" mpesa.secret="YOUR_SECRET" mpesa.passkey="YOUR_PASSKEY" mpesa.shortcode="174379" mpesa.callback_url="YOUR_CALLBACK_URL"
```

### 6. Deploy Cloud Functions
- Deploy the Cloud Functions: `firebase deploy --only functions`.

### 7. Configure Frontend
- Copy the Firebase configuration object from the Firebase Console.
- Update the `VITE_FIREBASE_*` variables in the `client/.env` file.

---
[Next: Database Schema](Database-Schema) | [Back to Home](Home)
