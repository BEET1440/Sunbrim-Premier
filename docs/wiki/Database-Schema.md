# Database Schema

Sunbrim Premier uses Cloud Firestore, a NoSQL database, to store and manage application data in real-time. For a more detailed design, see [FIRESTORE_SCHEMA.md](../FIRESTORE_SCHEMA.md).

## Firestore Collections

### 1. `users`
Stores profile information for customers, admins, and bulk buyers.
- **`userId`**: string (Document ID)
- **`phoneNumber`**: string (e.g., "+254712345678")
- **`name`**: string
- **`role`**: string ("customer" | "admin" | "bulkBuyer")
- **`createdAt`**: timestamp

### 2. `products`
The bakery's product catalog.
- **`productId`**: string (Document ID)
- **`name`**: string (e.g., "Wholemeal Bread")
- **`category`**: string ("bread" | "cakes" | "buns" | "pastries" | "cookies")
- **`price`**: number (KES)
- **`stockQuantity`**: number
- **`availableToday`**: boolean (Quick toggle for daily availability)
- **`imageUrl`**: string

### 3. `orders`
Customer orders and status tracking.
- **`orderId`**: string (Document ID)
- **`userId`**: string (Reference to `users.userId`)
- **`items`**: array<map> (Contains `productId`, `name`, `price`, `quantity`)
- **`totalAmount`**: number
- **`status`**: string ("Pending" | "Paid" | "Baking" | "OutForDelivery" | "Delivered")
- **`paymentStatus`**: string ("unpaid" | "completed" | "failed")
- **`location`**: map (address and coordinates)
- **`createdAt`**: timestamp

### 4. `payments`
Transaction history for M-Pesa payments.
- **`paymentId`**: string (Document ID)
- **`orderId`**: string (Reference to `orders.orderId`)
- **`mpesaReceiptNumber`**: string (Unique from Safaricom)
- **`amount`**: number
- **`status`**: string ("Success" | "Failed")
- **`timestamp`**: timestamp

### 5. `deliveries`
Logistics and delivery routing.
- **`deliveryId`**: string (Document ID)
- **`orderIds`**: array<string> (Batch of orders in one trip)
- **`routeArea`**: string (e.g., "Westlands")
- **`status`**: string ("Preparing" | "InTransit" | "Completed")

### 6. `bulkOrders`
Specialized handling for B2B/Bulk buyers.
- **`bulkOrderId`**: string (Document ID)
- **`businessName`**: string
- **`scheduledDates`**: array<timestamp> (Recurring order dates)
- **`negotiatedPrice`**: number (Custom rate)
- **`orderHistory`**: array<string> (References to past orders)

## Indexing Requirements
- **`orders`**: `userId` (ASC) + `createdAt` (DESC) for history.
- **`orders`**: `status` (ASC) + `createdAt` (DESC) for admin views.
- **`products`**: `category` (ASC) + `price` (ASC) for sorted browsing.

---
[Next: Payment Integration (M-Pesa)](Payment-Integration-M-Pesa) | [Back to Home](Home)
