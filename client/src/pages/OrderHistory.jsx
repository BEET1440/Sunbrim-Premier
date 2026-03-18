import React, { useState, useEffect } from 'react';
import OrderCard from '../components/OrderCard';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Package, Search, Calendar, Filter, ChevronDown } from 'lucide-react';

const OrderHistory = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, delivered, cancelled

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching history:", error);
        // Fallback for demo
        setOrders([
          { 
            id: 'ORD-123456', 
            items: [{ name: 'Soft Sandwich Bread', quantity: 2, price: 65 }], 
            totalAmount: 130, 
            status: 'Delivered', 
            createdAt: { seconds: Math.floor(Date.now()/1000) - 86400 * 2 },
            location: { address: 'Kileleshwa, Nairobi' }
          },
          { 
            id: 'ORD-789012', 
            items: [{ name: 'Chocolate Fudge Cake', quantity: 1, price: 1200 }], 
            totalAmount: 1200, 
            status: 'Delivered', 
            createdAt: { seconds: Math.floor(Date.now()/1000) - 86400 * 7 },
            location: { address: 'Nairobi West' }
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  const handleRepeatOrder = (order) => {
    console.log("Repeating order:", order);
    // Logic to add items to cart/modal will go here
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-900 leading-tight">Your Order <span className="text-primary-600">History</span></h1>
        <p className="text-gray-500 text-sm font-medium">Manage and re-order your favorites.</p>
      </div>

      <div className="flex items-center space-x-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {['all', 'pending', 'paid', 'baking', 'delivered'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2",
              filter === f ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-100" : "bg-white text-gray-500 border-orange-100 hover:border-primary-200"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />
          ))
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onRepeat={handleRepeatOrder} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center opacity-40">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <p className="font-bold text-gray-900">No orders found</p>
              <p className="text-xs">Start your first order on the Home page.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
