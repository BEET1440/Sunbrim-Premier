# Payment Integration (M-Pesa)

Sunbrim Premier integrates with the Safaricom Daraja API for M-Pesa payments using the STK Push (Lipa na M-Pesa Online) service.

## API Credentials
To enable M-Pesa payments, you must have the following credentials from the [Daraja Portal](https://developer.safaricom.co.ke/):
- **Consumer Key**: Your API key.
- **Consumer Secret**: Your API secret.
- **Passkey**: Your Lipa na M-Pesa Online passkey.
- **Shortcode**: Your Business Shortcode (e.g., `174379` for sandbox).

## Implementation Details

### 1. OAuth Token Generation
The Cloud Function `getMpesaToken` generates an OAuth token for secure communication with Safaricom.
```javascript
const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
const response = await axios.get(
  'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
  { headers: { Authorization: `Basic ${auth}` } }
);
```

### 2. STK Push Initiation
The Cloud Function `initiateStkPush` triggers an STK Push on the customer's phone.
```javascript
const response = await axios.post(
  'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: MPESA_SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: MPESA_CALLBACK_URL,
    AccountReference: 'SunbrimPremier',
    TransactionDesc: `Payment for ${productName}`,
  },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### 3. Payment Callback
The Cloud Function `mpesaCallback` handles the webhook from Safaricom and updates the order status in Firestore.
- **`ResultCode === 0`**: Successful payment. Updates status to "paid" and stores the M-Pesa Receipt Number.
- **`ResultCode !== 0`**: Failed payment. Updates status to "failed" and stores the failure reason.

## Security Considerations
- **Serverless Logic**: All payment logic is handled on the backend (Cloud Functions) to prevent exposing API keys on the frontend.
- **Credential Protection**: Credentials are stored securely using Firebase functions configuration (e.g., `firebase functions:config:set`).
- **Validation**: User phone numbers and payment amounts are validated before triggering the STK Push.

---
[Next: Admin Dashboard Guide](Admin-Dashboard-Guide) | [Back to Home](Home)
