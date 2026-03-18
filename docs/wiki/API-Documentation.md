# API Documentation

The Sunbrim Premier API is built with Firebase Cloud Functions and handles the logic for M-Pesa payments and order management.

## Endpoint Overview

### 1. `initiateStkPush`
- **Type**: HTTPS Callable Function
- **URL**: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/initiateStkPush`
- **Method**: POST
- **Payload**:
```json
{
  "phoneNumber": "254XXXXXXXXX",
  "amount": 100,
  "productId": "ORD-123",
  "productName": "Soft Sandwich Bread",
  "quantity": 2
}
```
- **Response**:
```json
{
  "success": true,
  "message": "STK Push initiated"
}
```

### 2. `mpesaCallback`
- **Type**: HTTPS Request (Webhook)
- **URL**: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/mpesaCallback`
- **Method**: POST
- **Payload**: Standard Safaricom M-Pesa Callback JSON structure.
- **Response**:
```text
Callback processed
```

### 3. `getMpesaToken` (Internal)
- **Type**: Internal Helper Function
- **Description**: Generates an OAuth token for M-Pesa API authentication.
- **Method**: GET
- **Response**: Standard M-Pesa OAuth response.

## Authentication & Security
- **HTTPS Callable Functions**: Automatically authenticate users via Firebase Auth context.
- **Webhook Endpoint**: The `mpesaCallback` endpoint is public but validates the payload before processing.
- **API Key Management**: All API keys are stored securely using Firebase functions configuration.

## Error Handling
The API uses standard HTTP error codes and returns a JSON object with a descriptive error message.
- **400 Bad Request**: Invalid payload or missing parameters.
- **401 Unauthenticated**: User must be logged in to call the `initiateStkPush` function.
- **500 Internal Server Error**: Failed to authenticate with M-Pesa or process the payment callback.

---
[Next: Troubleshooting](Troubleshooting) | [Back to Home](Home)
