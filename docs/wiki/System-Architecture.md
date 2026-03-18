# System Architecture

The Sunbrim Premier system uses a serverless, cloud-first architecture to ensure scalability and ease of maintenance.

## Architecture Overview
The application consists of three main parts:
1.  **React Frontend (Client)**: A single-page application (SPA) built with Vite and Tailwind CSS.
2.  **Firebase Services**: Providing authentication (Auth), data storage (Firestore), and serverless logic (Cloud Functions).
3.  **External Payment Gateway**: Integration with Safaricom's Daraja API for M-Pesa payments.

## Component Interaction
1.  **User Authentication**: Customers log in via Firebase Auth using their phone number and an OTP.
2.  **Order Placement**: When a user selects a product and provides their phone number, the frontend calls a Firebase Cloud Function.
3.  **Payment Processing**: The Cloud Function communicates with the M-Pesa Daraja API to trigger an STK Push on the user's phone.
4.  **Order Recording**: A "pending_payment" order is recorded in Firestore.
5.  **Payment Callback**: After the user completes payment, Safaricom sends a callback to a public HTTPS Cloud Function endpoint.
6.  **Status Update**: The callback function updates the order status in Firestore (e.g., "paid").
7.  **Real-time Monitoring**: The Admin Dashboard and Customer Tracking page reflect the status change instantly via Firestore's real-time listeners.

## Key Design Principles
- **Mobile-First**: Every feature is designed for touch screens and mobile browser constraints.
- **State Minimalism**: No complex state management (like Redux); built-in React hooks and Firestore's real-time capabilities are used.
- **Performance**: Optimized asset sizes and minimal third-party dependencies.
- **Security**: Payment logic is handled exclusively on the backend (Cloud Functions) to protect API credentials.

---
[Next: Frontend Structure](Frontend-Structure) | [Back to Home](Home)
