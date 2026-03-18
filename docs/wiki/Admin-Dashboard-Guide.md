# Admin Dashboard Guide

The Sunbrim Premier Admin Dashboard provides bakery staff with a central interface for managing orders and monitoring performance.

## Dashboard Overview
The dashboard is accessible at `/admin`.

### 1. Stats Summary
The top of the dashboard displays key metrics:
- **Daily Revenue**: Total revenue generated from paid orders today.
- **Total Orders**: Total number of orders placed in the system.

### 2. Navigation Tabs
- **Orders**: View and manage recent customer orders.
- **Products**: Manage the bakery's product catalog (e.g., add new products, update prices).

### 3. Order Management
The "Orders" tab displays a list of recent orders with the following information:
- **Order ID**: Unique order identifier.
- **Product Name**: Name of the ordered item.
- **Phone Number**: Customer's phone number.
- **Amount**: Total order amount in KSh.
- **Status**: Current order status (e.g., "paid", "processing", "delivered").

### 4. Updating Order Status
Staff can update the status of an order using the following actions:
- **Process Order**: Click the clock icon to move a "paid" order to "processing".
- **Deliver Order**: Click the checkmark icon to move a "processing" order to "delivered".
- **More Options**: Access additional order details or cancel an order.

### 5. Product Management (Upcoming)
The "Products" tab will soon support the following features:
- **Add New Product**: Add new bakery items with a name, price, category, and image.
- **Update Price**: Update the price of an existing product.
- **Availability Toggle**: Quickly enable or disable a product's availability.

## Security & Access
- **Admin Authentication**: Access to the `/admin` page is currently protected by a simple check (e.g., an "admin" flag in the user's Firestore profile).
- **Audit Logging**: All order status updates are logged in Firestore for accountability.

---
[Next: Deployment Guide](Deployment-Guide) | [Back to Home](Home)
