import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

/**
 * Get all available products
 * @param {string} category - Optional filter by category
 */
export const getProducts = async (category = 'all') => {
  const q = category === 'all' 
    ? query(collection(db, 'products'), where('availableToday', '==', true)) 
    : query(collection(db, 'products'), where('category', '==', category), where('availableToday', '==', true));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Get a single order by ID
 * @param {string} orderId 
 */
export const getOrderById = async (orderId) => {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);
  
  if (orderSnap.exists()) {
    return { id: orderSnap.id, ...orderSnap.data() };
  } else {
    throw new Error("Order not found");
  }
};

/**
 * Get orders for a specific user
 * @param {string} userId 
 */
export const getUserOrders = async (userId) => {
  const q = query(
    collection(db, 'orders'), 
    where('userId', '==', userId), 
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Update the status of an order
 * @param {string} orderId 
 * @param {string} newStatus 
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { 
    status: newStatus,
    updatedAt: serverTimestamp() 
  });
};

/**
 * Create a new order
 * @param {object} orderData - { userId, phoneNumber, items, totalAmount, location }
 */
export const createOrder = async (orderData) => {
  if (!orderData.items || orderData.items.length === 0) {
    throw new Error("Order must contain at least one item.");
  }
  if (!orderData.phoneNumber) {
    throw new Error("Phone number is required for M-Pesa payment.");
  }

  try {
    const orderRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'Pending',
      paymentStatus: 'unpaid',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return orderRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

/**
 * Repeat a previous order
 * @param {string} orderId 
 */
export const repeatOrder = async (orderId) => {
  try {
    const oldOrder = await getOrderById(orderId);
    const { id, status, paymentStatus, createdAt, updatedAt, ...newOrderData } = oldOrder;
    
    return await createOrder(newOrderData);
  } catch (error) {
    console.error("Error repeating order:", error);
    throw error;
  }
};

/**
 * Create a new user profile in Firestore
 * @param {string} userId 
 * @param {object} userData 
 */
export const createUserProfile = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  await addDoc(userRef, {
    ...userData,
    role: 'customer',
    createdAt: serverTimestamp()
  });
};
