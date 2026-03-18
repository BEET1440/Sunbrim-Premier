# Database Schema

Sunbrim Premier uses Cloud Firestore, a NoSQL database, to store and manage application data in real-time.

## Firestore Collections

### 1. `products`
The `products` collection stores information about all items available in the bakery.

- **`id`** (String): Unique identifier for each product.
- **`name`** (String): Name of the product (e.g., "Soft Sandwich Bread").
- **`price`** (Number): Price in KSh.
- **`category`** (String): Bakery category (e.g., "bread", "cakes", "buns", "pastries", "cookies").
- **`description`** (String): Brief product description.
- **`image`** (String): URL to the product image.
- **`isAvailable`** (Boolean): Availability status for the product.
- **`createdAt`** (Timestamp): Time the product was added.

### 2. `orders`
The `orders` collection stores customer orders and their status.

- **`id`** (String): Unique order identifier.
- **`userId`** (String): Firebase Auth user ID or "guest".
- **`phoneNumber`** (String): Customer's M-Pesa phone number in `254XXXXXXXXX` format.
- **`productId`** (String): Reference to the product being ordered.
- **`productName`** (String): Name of the product for quick reference.
- **`quantity`** (Number): Quantity of the product.
- **`amount`** (Number): Total order amount in KSh.
- **`status`** (String): Order status (e.g., "pending_payment", "paid", "processing", "delivered", "failed").
- **`merchantRequestId`** (String): M-Pesa Merchant Request ID.
- **`checkoutRequestId`** (String): M-Pesa Checkout Request ID.
- **`mpesaReceipt`** (String): M-Pesa Receipt Number (added after successful payment).
- **`paidAt`** (Timestamp): Time the payment was confirmed.
- **`createdAt`** (Timestamp): Time the order was initiated.
- **`failureReason`** (String): Reason for payment failure (if applicable).

### 3. `settings` (Optional)
A singleton collection for global app settings.

- **`storeStatus`** (Boolean): Open/Closed status of the bakery.
- **`minimumOrderAmount`** (Number): Minimum value for a single order.
- **`mpesaShortcode`** (String): The M-Pesa shortcode being used for payments.

## Indexing Requirements
- **`orders`**: An index is required for querying orders by `phoneNumber` and `createdAt` (descending) to support real-time tracking.

---
[Next: Payment Integration (M-Pesa)](Payment-Integration-M-Pesa) | [Back to Home](Home)
