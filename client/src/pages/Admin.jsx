import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { LayoutDashboard, ShoppingBag, ListChecks, Settings, MoreVertical, Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders, products
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Fallback for demo
        setOrders([
          { id: 'ORD-1', productName: 'Soft Bread', phoneNumber: '254712345678', amount: 65, status: 'paid', createdAt: { seconds: Date.now()/1000 - 3600 } },
          { id: 'ORD-2', productName: 'Choco Cake', phoneNumber: '254787654321', amount: 1200, status: 'processing', createdAt: { seconds: Date.now()/1000 - 7200 } },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
        <div className="p-2 bg-orange-100 rounded-lg text-primary-600">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 bg-primary-600 text-white border-none shadow-lg shadow-primary-200">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Daily Revenue</p>
          <h2 className="text-2xl font-black">KSh 12.5k</h2>
        </div>
        <div className="card p-4 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Orders</p>
          <h2 className="text-2xl font-black text-gray-900">42</h2>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-orange-100/50 p-1 rounded-2xl">
        <button 
          onClick={() => setActiveTab('orders')}
          className={clsx(
            "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2",
            activeTab === 'orders' ? "bg-white text-primary-600 shadow-sm" : "text-gray-500"
          )}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders</span>
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={clsx(
            "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2",
            activeTab === 'products' ? "bg-white text-primary-600 shadow-sm" : "text-gray-500"
          )}
        >
          <ListChecks className="w-4 h-4" />
          <span>Products</span>
        </button>
      </div>

      {/* Orders List */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Recent Orders</h2>
            <button className="text-xs font-bold text-primary-600 hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="card p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-gray-400">#{order.id.slice(-4)}</span>
                      <h3 className="font-bold text-gray-900">{order.productName}</h3>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">+{order.phoneNumber}</p>
                  </div>
                  <div className={clsx(
                    "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                    order.status === 'paid' ? 'bg-blue-50 text-blue-600' : 
                    order.status === 'processing' ? 'bg-orange-50 text-orange-600' :
                    'bg-green-50 text-green-600'
                  )}>
                    {order.status}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-orange-50">
                  <span className="font-black text-gray-900">KSh {order.amount}</span>
                  <div className="flex space-x-2">
                    {order.status === 'paid' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'processing')}
                        className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                        title="Process"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button 
                        onClick={() => updateStatus(order.id, 'delivered')}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Deliver"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-gray-200 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Tab (Placeholder) */}
      {activeTab === 'products' && (
        <div className="text-center py-12 card bg-white">
          <ListChecks className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Product management coming soon.</p>
          <button className="mt-4 btn-outline text-xs">Add New Product</button>
        </div>
      )}
    </div>
  );
};

export default Admin;
