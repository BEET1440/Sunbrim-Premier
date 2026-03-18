const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

// M-Pesa Configuration (Should be set using firebase functions:config:set)
const MPESA_CONSUMER_KEY = functions.config().mpesa?.key || 'your_key';
const MPESA_CONSUMER_SECRET = functions.config().mpesa?.secret || 'your_secret';
const MPESA_PASSKEY = functions.config().mpesa?.passkey || 'your_passkey';
const MPESA_SHORTCODE = functions.config().mpesa?.shortcode || '174379'; // Sandbox shortcode
const MPESA_CALLBACK_URL = functions.config().mpesa?.callback_url || 'https://your-app.web.app/api/mpesaCallback';

/**
 * Generate M-Pesa OAuth Token
 */
const getMpesaToken = async () => {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Mpesa Token Error:", error.response?.data || error.message);
    throw new functions.https.HttpsError('internal', 'Failed to authenticate with M-Pesa');
  }
};

/**
 * Initiate STK Push
 */
exports.initiateStkPush = functions.region('europe-west1').https.onCall(async (data, context) => {
  // Check if user is authenticated
  // if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');

  const { phoneNumber, amount, productId, productName, quantity } = data;
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

  try {
    const token = await getMpesaToken();
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

    // Save order as pending in Firestore
    await db.collection('orders').add({
      userId: context.auth?.uid || 'guest',
      phoneNumber,
      productId,
      productName,
      quantity,
      amount,
      status: 'pending_payment',
      merchantRequestId: response.data.MerchantRequestID,
      checkoutRequestId: response.data.CheckoutRequestID,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: 'STK Push initiated' };
  } catch (error) {
    console.error("STK Push Error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.errorMessage || 'Failed to initiate payment' };
  }
});

/**
 * M-Pesa Callback (Webhook)
 */
exports.mpesaCallback = functions.region('europe-west1').https.onRequest(async (req, res) => {
  const { Body } = req.body;
  if (!Body.stkCallback) return res.status(400).send('Invalid callback');

  const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;

  try {
    const ordersQuery = await db.collection('orders')
      .where('checkoutRequestId', '==', CheckoutRequestID)
      .limit(1)
      .get();

    if (ordersQuery.empty) return res.status(404).send('Order not found');

    const orderDoc = ordersQuery.docs[0];
    
    if (ResultCode === 0) {
      // Payment Successful
      await orderDoc.ref.update({
        status: 'paid',
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
        mpesaReceipt: Body.stkCallback.CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber').Value
      });
    } else {
      // Payment Failed
      await orderDoc.ref.update({
        status: 'failed',
        failureReason: ResultDesc
      });
    }

    res.status(200).send('Callback processed');
  } catch (error) {
    console.error("Callback Processing Error:", error);
    res.status(500).send('Internal Server Error');
  }
});
