# Sunbrim Premier - Bakery eCommerce System

## Project Overview
Sunbrim Premier is a full-stack, lightweight ecommerce platform specifically designed for the bread and bakery confectionery industry. The system streamlines the ordering process for high-turnover items like bread, cakes, buns, and pastries. By focusing on a mobile-first experience and low-bandwidth optimization, it provides a seamless shopping experience for customers in regions with varying internet speeds.

The application features a unique "Quick Order" system that eliminates complex cart management, allowing users to place orders and pay via M-Pesa in just a few taps.

## Core Features
- **🥖 Dynamic Product Catalog**: Categorized browsing for bread, cakes, buns, pastries, and cookies.
- **⚡ Quick Order System**: Single-tap ordering with quantity adjustment directly from the product card.
- **📱 Phone Authentication**: Secure, passwordless login using Firebase Phone OTP (One-Time Password).
- **💸 M-Pesa Integration**: Native STK Push integration via the Safaricom Daraja API for instant payments.
- **📦 Real-time Order Tracking**: Customers can track their order status (Pending, Paid, Processing, Delivered) using their phone number.
- **🔄 Repeat Order Feature**: One-click re-ordering of previous purchases from the tracking page.
- **🛠️ Admin Dashboard**: Centralized management for orders, status updates, and product availability.
- **🏢 Bulk Buyer Support**: Specialized inquiries for large-scale orders and events.
- **📴 Offline-Friendly Behavior**: Basic asset caching using Service Workers for improved reliability in poor network conditions.

## Tech Stack
- **Frontend**: 
  - **React.js (Vite)**: For a fast, reactive, and modern user interface.
  - **Tailwind CSS**: Utility-first styling for rapid development and high performance.
  - **Lucide-React**: Lightweight and consistent iconography.
- **Backend (Firebase)**:
  - **Firestore**: Scalable NoSQL database for real-time data storage.
  - **Firebase Auth**: Secure phone number authentication.
  - **Cloud Functions**: Serverless Node.js functions to handle secure M-Pesa API communication.
- **Payment**:
  - **Safaricom Daraja API**: Direct M-Pesa STK Push (Lipa na M-Pesa Online) for mobile-first payments.

## Project Structure
```text
/
├── client/                 # React Frontend (Vite)
│   ├── public/             # Static assets & Service Worker
│   └── src/
│       ├── components/     # UI Components (Header, ProductCard, OrderModal)
│       ├── pages/          # Page Views (Home, Tracking, Admin, Login)
│       ├── firebase/       # Configuration and SDK initialization
│       └── index.css       # Tailwind & Global Styles
├── functions/              # Firebase Cloud Functions (Node.js)
│   ├── index.js            # M-Pesa STK Push and Callback logic
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/sunbrim-premier.git
cd sunbrim-premier
```

### 2. Frontend Setup (React)
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory based on `.env.example`:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Backend Setup (Firebase Functions)
```bash
cd ../functions
npm install
```

## M-Pesa Integration Setup
To enable M-Pesa payments, you must configure your Daraja API credentials in Firebase Cloud Functions:

1. **Get Credentials**: Register on the [Safaricom Daraja Portal](https://developer.safaricom.co.ke/) and create a Lipa na M-Pesa (LNM) app.
2. **Set Config**: Run the following command using the Firebase CLI:
```bash
firebase functions:config:set mpesa.key="CONSUMER_KEY" \
                             mpesa.secret="CONSUMER_SECRET" \
                             mpesa.passkey="LNM_PASSKEY" \
                             mpesa.shortcode="BUSINESS_SHORTCODE" \
                             mpesa.callback_url="https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/mpesaCallback"
```
3. **Deploy Functions**:
```bash
firebase deploy --only functions
```

## Screenshots
*Place screenshots of the application here to showcase the UI/UX.*
- **[Home Page Placeholder]**
- **[Quick Order Modal Placeholder]**
- **[Admin Dashboard Placeholder]**

## Future Improvements
- [ ] **Advanced Caching**: Full offline product browsing using IndexedDB.
- [ ] **Push Notifications**: Real-time alerts for order status changes.
- [ ] **Inventory Management**: Automated stock deduction upon successful payment.
- [ ] **Bulk Pricing Logic**: Dynamic price adjustment for large quantity orders.
- [ ] **Multi-location Support**: Support for different bakery branches with location-based filtering.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
