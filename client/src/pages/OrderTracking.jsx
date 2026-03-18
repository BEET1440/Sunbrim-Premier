import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Package, Clock, CheckCircle2, RefreshCcw, Search, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchOrders = async (phone) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'orders'),
        where('phoneNumber', '==', phone.startsWith('254') ? phone : `254${phone.replace(/^0+/, '')}`),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setSearched(true);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Fallback for demo
      if (phone === '0712345678' || phone === '712345678') {
        setOrders([
          { id: 'ORD-123', productName: 'Soft Sandwich Bread', quantity: 2, amount: 130, status: 'delivered', createdAt: { seconds: Date.now()/1000 - 86400 } },
          { id: 'ORD-124', productName: 'Chocolate Fudge Cake', quantity: 1, amount: 1200, status: 'processing', createdAt: { seconds: Date.now()/1000 } },
        ]);
        setSearched(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (phoneNumber) fetchOrders(phoneNumber);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-orange-600 bg-orange-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
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
              <div key={order.id} className="card p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID: {order.id.slice(0, 8)}</span>
                    <h3 className="font-bold text-gray-900">{order.productName}</h3>
                    <p className="text-xs text-gray-500">
                      {order.quantity} x KSh {order.amount / order.quantity}
                    </p>
                  </div>
                  <div className={clsx(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1",
                    getStatusColor(order.status)
                  )}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-orange-50">
                  <div className="text-xs text-gray-400">
                    {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                  </div>
                  <button 
                    className="flex items-center space-x-1 text-primary-600 text-xs font-bold hover:underline"
                    onClick={() => console.log("Repeating order:", order)}
                  >
                    <RefreshCcw className="w-3 h-3" />
                    <span>Repeat Order</span>
                  </button>
                </div>
              </div>
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
