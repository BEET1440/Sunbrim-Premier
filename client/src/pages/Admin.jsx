import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs, updateDoc, doc, addDoc, deleteDoc, where } from 'firebase/firestore';
import { 
  LayoutDashboard, ShoppingBag, ListChecks, Settings, MoreVertical, 
  Search, CheckCircle, Clock, XCircle, Plus, Edit2, Trash2, 
  Users, TrendingUp, Package, Filter, ChevronDown, Save, X
} from 'lucide-react';
import { clsx } from 'clsx';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders, products, bulk
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [bulkBuyers, setBulkBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', category: 'bread', stockQuantity: 100, availableToday: true, description: ''
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'orders') {
          const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
          const snap = await getDocs(q);
          setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else if (activeTab === 'products') {
          const q = query(collection(db, 'products'), orderBy('category', 'asc'));
          const snap = await getDocs(q);
          setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else if (activeTab === 'bulk') {
          const q = query(collection(db, 'users'), where('role', '==', 'bulkBuyer'));
          const snap = await getDocs(q);
          setBulkBuyers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  // Order Actions
  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) { alert("Failed to update status"); }
  };

  // Product Actions
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...newProduct,
        price: Number(newProduct.price),
        stockQuantity: Number(newProduct.stockQuantity),
        createdAt: new Date()
      });
      setProducts([{ id: docRef.id, ...newProduct }, ...products]);
      setIsAddingProduct(false);
      setNewProduct({ name: '', price: '', category: 'bread', stockQuantity: 100, availableToday: true, description: '' });
    } catch (err) { alert("Failed to add product"); }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Revenue Summary
  const totalRevenue = orders.filter(o => o.status === 'Paid' || o.status === 'Delivered' || o.status === 'Baking' || o.status === 'OutForDelivery')
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Bakery Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium">Manage SunbrimPremier Operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center bg-white px-3 py-1.5 rounded-lg border border-orange-100 text-xs font-bold text-primary-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            LIVE STATUS
          </div>
          <button className="p-2 bg-white border border-orange-100 rounded-xl text-gray-400 hover:text-primary-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6 bg-primary-600 text-white border-none shadow-xl shadow-primary-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Real-time</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Revenue</p>
          <h2 className="text-3xl font-black">KSh {totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="card p-6 bg-white border-orange-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-primary-600"><ShoppingBag className="w-5 h-5" /></div>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Orders Today</p>
          <h2 className="text-3xl font-black text-gray-900">{orders.length}</h2>
        </div>
        <div className="card p-6 bg-white border-orange-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Bulk Buyers</p>
          <h2 className="text-3xl font-black text-gray-900">{bulkBuyers.length || 0}</h2>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex bg-orange-100/30 p-1.5 rounded-2xl border border-orange-100/50">
        {[
          { id: 'orders', label: 'Orders', icon: ShoppingBag },
          { id: 'products', label: 'Inventory', icon: ListChecks },
          { id: 'bulk', label: 'Bulk Buyers', icon: Users },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2",
              activeTab === tab.id ? "bg-white text-primary-600 shadow-sm border border-orange-100" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Orders View */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search by Order ID or Phone..." className="w-full bg-white border border-orange-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {['all', 'Pending', 'Paid', 'Baking', 'Delivered'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFilter(s)}
                  className={clsx(
                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap",
                    filter === s ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-500 border-orange-100"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50/50 border-b border-orange-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Items</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {orders.filter(o => filter === 'all' || o.status === filter).map(order => (
                  <tr key={order.id} className="hover:bg-orange-50/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-400 text-xs">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">+{order.phoneNumber}</div>
                      <div className="text-[10px] text-gray-400 font-medium">Guest User</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {order.items?.map(i => i.name).join(', ') || order.productName}
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 text-sm">KSh {order.totalAmount || order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        order.status === 'Paid' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Baking' ? 'bg-orange-100 text-orange-700' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-500'
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {order.status === 'Paid' && (
                          <button onClick={() => updateStatus(order.id, 'Baking')} className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors" title="Start Baking"><Clock className="w-4 h-4" /></button>
                        )}
                        {order.status === 'Baking' && (
                          <button onClick={() => updateStatus(order.id, 'OutForDelivery')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Dispatch"><Package className="w-4 h-4" /></button>
                        )}
                        {order.status === 'OutForDelivery' && (
                          <button onClick={() => updateStatus(order.id, 'Delivered')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Complete"><CheckCircle className="w-4 h-4" /></button>
                        )}
                        <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory View */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Product Management</h2>
            <button 
              onClick={() => setIsAddingProduct(true)}
              className="btn-primary py-2 px-4 flex items-center space-x-2 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {isAddingProduct && (
            <div className="card p-6 bg-orange-50 border-primary-200 animate-in fade-in slide-in-from-top-4 duration-300">
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                  <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} type="text" className="w-full p-3 bg-white border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (KSh)</label>
                  <input required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} type="number" className="w-full p-3 bg-white border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-3 bg-white border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="bread">Bread</option>
                    <option value="cakes">Cakes</option>
                    <option value="buns">Buns</option>
                    <option value="pastries">Pastries</option>
                    <option value="cookies">Cookies</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Stock</label>
                  <input required value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: e.target.value})} type="number" className="w-full p-3 bg-white border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="flex items-end space-x-2">
                  <button type="submit" className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2"><Save className="w-4 h-4" /><span>Save</span></button>
                  <button type="button" onClick={() => setIsAddingProduct(false)} className="p-3 bg-white border border-orange-200 text-gray-400 rounded-xl hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="card p-4 flex items-center justify-between group hover:border-primary-100 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-primary-600 border border-orange-100">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category} • KSh {product.price}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className={clsx("w-1.5 h-1.5 rounded-full", product.availableToday ? "bg-green-500" : "bg-red-500")} />
                      <span className="text-[10px] font-medium text-gray-500">{product.stockQuantity} in stock</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Buyers View */}
      {activeTab === 'bulk' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Bulk Buyers Directory</h2>
            <button className="btn-outline py-2 px-4 text-xs">Export CSV</button>
          </div>
          <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50/50 border-b border-orange-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Business Name</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Joined</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50 text-sm">
                {bulkBuyers.length > 0 ? bulkBuyers.map(buyer => (
                  <tr key={buyer.id} className="hover:bg-orange-50/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{buyer.businessName || 'Bakery Partner'}</td>
                    <td className="px-6 py-4 font-medium text-gray-600">+{buyer.phoneNumber}</td>
                    <td className="px-6 py-4 text-gray-400">{new Date(buyer.createdAt?.seconds * 1000).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary-600 font-bold text-xs hover:underline">View History</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium italic">No bulk buyers registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
