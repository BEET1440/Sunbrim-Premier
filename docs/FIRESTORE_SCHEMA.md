# SunbrimPremier Firestore Database Schema

This document outlines the detailed Firestore database structure for the SunbrimPremier bakery ecommerce platform, optimized for fast reads, real-time updates, and mobile-first performance.

## 1. Collections Structure

### `users`
Stores profile information for customers, admins, and bulk buyers.
- **`userId`**: string (Document ID)
- **`phoneNumber`**: string (e.g., "+254712345678")
- **`name`**: string
- **`role`**: string ("customer" | "admin" | "bulkBuyer")
- **`email`**: string (optional)
- **`fcmToken`**: string (for push notifications)
- **`defaultLocation`**: geopoint (latitude, longitude)
- **`createdAt`**: timestamp
- **`lastActive`**: timestamp

### `products`
The bakery's product catalog.
- **`productId`**: string (Document ID)
- **`name`**: string (e.g., "Wholemeal Bread")
- **`category`**: string ("bread" | "cakes" | "buns" | "pastries" | "cookies")
- **`price`**: number (KES)
- **`stockQuantity`**: number
- **`availableToday`**: boolean (Quick toggle for daily availability)
- **`imageUrl`**: string (Firebase Storage URL)
- **`description`**: string
- **`unit`**: string (e.g., "400g", "1kg", "pc")
- **`tags`**: array<string> (e.g., ["sugar-free", "whole-grain"])

### `orders`
Customer orders and status tracking.
- **`orderId`**: string (Document ID)
- **`userId`**: string (Reference to `users.userId`)
- **`items`**: array<map>
  - **`productId`**: string
  - **`name`**: string (Denormalized for fast display)
  - **`price`**: number
  - **`quantity`**: number
- **`totalAmount`**: number
- **`status`**: string ("Pending" | "Paid" | "Baking" | "OutForDelivery" | "Delivered")
- **`paymentStatus`**: string ("unpaid" | "processing" | "completed" | "failed")
- **`location`**: map
  - **`address`**: string
  - **`coordinates`**: geopoint
- **`deliveryNotes`**: string
- **`createdAt`**: timestamp
- **`updatedAt`**: timestamp

### `payments`
Transaction history for M-Pesa payments.
- **`paymentId`**: string (Document ID)
- **`orderId`**: string (Reference to `orders.orderId`)
- **`userId`**: string (Reference to `users.userId`)
- **`mpesaReceiptNumber`**: string (Unique from Safaricom)
- **`amount`**: number
- **`status`**: string ("Success" | "Failed" | "Cancelled")
- **`phoneNumber`**: string (Payer's number)
- **`checkoutRequestId`**: string (M-Pesa reference)
- **`merchantRequestId`**: string (M-Pesa reference)
- **`timestamp`**: timestamp

### `deliveries`
Logistics and delivery routing.
- **`deliveryId`**: string (Document ID)
- **`orderIds`**: array<string> (Batch of orders in one trip)
- **`riderId`**: string (Reference to `users.userId` with rider role)
- **`routeArea`**: string (e.g., "Westlands", "Kilimani")
- **`status`**: string ("Preparing" | "InTransit" | "Completed")
- **`startTime`**: timestamp
- **`completionTime`**: timestamp

### `bulkOrders`
Specialized handling for B2B/Bulk buyers.
- **`bulkOrderId`**: string (Document ID)
- **`userId`**: string (Reference to `users.userId`)
- **`businessName`**: string
- **`scheduledDates`**: array<timestamp> (Recurring order dates)
- **`negotiatedPrice`**: number (Custom rate for bulk buyer)
- **`contractStatus`**: string ("Active" | "Expired" | "Pending")
- **`orderHistory`**: array<string> (References to past `orders.orderId`)

---

## 2. Relationships

- **One-to-Many (User -> Orders)**: A user can have many orders. Managed by storing `userId` in the `orders` document.
- **Many-to-Many (Orders -> Products)**: Handled by the `items` array inside the `orders` document (Denormalized for read performance).
- **One-to-One (Order -> Payment)**: Each successful order has one payment record. Linked via `orderId`.
- **One-to-Many (Delivery -> Orders)**: A delivery trip contains multiple orders via the `orderIds` array.

---

## 3. Indexing Suggestions

### Single Field Indexes
- `users.phoneNumber` (Unique lookup)
- `products.category` (Filtering by type)
- `products.availableToday` (Daily availability filter)
- `orders.status` (Admin dashboard filtering)
- `payments.checkoutRequestId` (M-Pesa callback matching)

### Composite Indexes (Required)
- `orders`: `userId` (ASC) + `createdAt` (DESC) -> For "My Orders" history.
- `orders`: `status` (ASC) + `createdAt` (DESC) -> For Admin "Recent Orders" by status.
- `products`: `category` (ASC) + `price` (ASC) -> For sorted product browsing.
- `deliveries`: `routeArea` (ASC) + `status` (ASC) -> For logistics planning.

---

## 4. Optimization for Fast Reads

1. **Denormalization**:
   - Store `productName` and `price` inside the `orders.items` array. This avoids making N extra reads to the `products` collection when viewing an order summary.
   - Store the latest `orderStatus` inside the `users` document if needed for a "Recent Order" badge on the profile.

2. **Query Limitations**:
   - Always use `.limit(20)` for product listings and order history to minimize data transfer.
   - Use `availableToday == true` as a default filter for the customer-facing catalog.

3. **Bundling Updates**:
   - When a payment is successful, use a **Firestore Transaction** to update `orders.paymentStatus`, `orders.status`, and create a `payments` document simultaneously.

4. **Security Rules Optimization**:
   - Use `get()` in security rules sparingly. Prefer checking data already present in the document being accessed to keep latency low.

---
*Last Updated: 2026-03-18*
