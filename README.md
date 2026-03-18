# Sunbrim Premier - Bakery eCommerce

A lightweight, mobile-first full-stack ecommerce application for a bakery business.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Cloud Functions)
- **Payment**: M-Pesa Daraja API (STK Push)

## Core Features
- 🥐 **Product Catalog**: Filtered by category (Bread, Cakes, Buns, etc.)
- ⚡ **Quick Order**: One-tap order modal with quantity selection.
- 📱 **Phone Auth**: Secure login via Firebase Phone OTP.
- 💸 **M-Pesa Integration**: Direct payment prompts using Safaricom Daraja API.
- 📦 **Order Tracking**: Simple status tracking for customers.
- 🔄 **Repeat Orders**: Quick re-ordering from history.
- 🛠️ **Admin Dashboard**: Manage orders and product availability.
- 📴 **Offline Friendly**: Basic caching via Service Workers.

## Project Structure
- `/client`: React frontend application.
- `/functions`: Firebase Cloud Functions (Node.js).

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Firebase CLI (`npm install -g firebase-tools`)
- Safaricom Daraja API Developer Account

### Frontend Setup
1. `cd client`
2. `npm install`
3. Create `.env` from `.env.example` and add your Firebase config.
4. `npm run dev`

### Backend Setup
1. `cd functions`
2. `npm install`
3. Configure M-Pesa keys:
   ```bash
   firebase functions:config:set mpesa.key="YOUR_KEY" mpesa.secret="YOUR_SECRET" mpesa.passkey="YOUR_PASSKEY" mpesa.shortcode="174379" mpesa.callback_url="YOUR_CALLBACK_URL"
   ```
4. `firebase deploy --only functions`

## Design Notes
- **Mobile-First**: Optimized for small screens and touch interactions.
- **Low Bandwidth**: Minimal external libraries and optimized asset loading.
- **Clean UI**: High contrast, large buttons, and intuitive navigation.
