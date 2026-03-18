import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Search, Package, Clock, RefreshCcw } from 'lucide-react';
import OrderCard from '../components/OrderCard';

const OrderTracking = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber?.replace('+254', '0') || '');
  const [searched, setSearched] = useState(false);

  const fetchOrders = async (phone) => {
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('254') ? phone : `254${phone.replace(/^0+/, '')}`;
      const q = query(
        collection(db, 'orders'),
        where('phoneNumber', '==', formattedPhone),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setSearched(true);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback for demo
      setOrders([
        { 
          id: 'ORD-TRACK-1', 
          items: [{ name: 'Soft Sandwich Bread', quantity: 2, price: 65 }], 
          totalAmount: 130, 
          status: 'Baking', 
          createdAt: { seconds: Math.floor(Date.now()/1000) },
          location: { address: 'Current Location' }
        }
      ]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (phoneNumber) fetchOrders(phoneNumber);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-gray-900">Track Your Order</h1>
        <p className="text-gray-500 text-sm">Enter your phone number to see your order history.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="tel"
          placeholder="07XX XXX XXX"
          className="w-full bg-white border border-orange-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm text-sm"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
        >
          Track
        </button>
      </form>

      <div className="space-y-4">
        {searched ? (
          orders.length > 0 ? (
            orders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onRepeat={(o) => console.log("Repeat:", o)}
              />
            ))
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Package className="w-8 h-8" />
              </div>
              <p className="text-gray-500 text-sm">No orders found for this number.</p>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            Recent orders will appear here.
          </div>
        )}
      </div>

      {/* Quick navigation */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <button className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-orange-100 space-y-2 group active:scale-95 transition-all shadow-sm">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-primary-50 transition-colors">
            <Clock className="text-primary-600 w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-700">Recent Orders</span>
        </button>
        <button className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-orange-100 space-y-2 group active:scale-95 transition-all shadow-sm">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-primary-50 transition-colors">
            <RefreshCcw className="text-primary-600 w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-700">Favorites</span>
        </button>
      </div>
    </div>
  );
};

export default OrderTracking;
