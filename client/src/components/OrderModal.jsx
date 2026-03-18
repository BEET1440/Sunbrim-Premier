import React, { useState } from 'react';
import { X, Plus, Minus, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import { createOrder } from '../firebase/db';

const OrderModal = ({ product, onClose, user }) => {
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber?.replace('+254', '0') || '');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, processing, success, error

  const total = product.price * quantity;

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('processing');

    const formattedPhone = phoneNumber.startsWith('254') ? phoneNumber : `254${phoneNumber.replace(/^0+/, '')}`;

    // Check if offline
    if (!navigator.onLine) {
      const offlineOrder = {
        userId: user?.uid || 'guest',
        phoneNumber: formattedPhone,
        items: [{
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity
        }],
        totalAmount: total,
        location: { address: 'Self-Pickup (Offline)' },
        createdAt: new Date().toISOString()
      };
      
      const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
      offlineOrders.push(offlineOrder);
      localStorage.setItem('offline_orders', JSON.stringify(offlineOrders));
      
      setLoading(false);
      setStatus('success');
      return;
    }

    try {
      // 1. Create order in Firestore first (as Pending)
      const orderId = await createOrder({
        userId: user?.uid || 'guest',
        phoneNumber: formattedPhone,
        items: [{
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity
        }],
        totalAmount: total,
        location: { address: 'Self-Pickup' } // Default for now
      });

      // 2. Initiate STK Push via Cloud Function
      const initiateStkPush = httpsCallable(functions, 'initiateStkPush');
      const response = await initiateStkPush({
        phoneNumber: formattedPhone,
        amount: total,
        orderId: orderId, // Pass the newly created orderId
        productName: product.name,
        quantity: quantity,
      });

      if (response.data.success) {
        setStatus('success');
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (error) {
      console.error("Payment error:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center space-y-4 animate-in fade-in zoom-in slide-in-from-bottom-10 duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
          <p className="text-gray-500 text-sm">
            Please check your phone for the M-Pesa prompt to complete payment.
          </p>
          <button onClick={onClose} className="w-full btn-primary py-4 text-lg font-bold">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="relative h-48 bg-orange-50">
          <img 
            src={product.image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300&auto=format&fit=crop"} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-xl font-black text-gray-900">{product.name}</h2>
              <span className="text-xl font-black text-primary-600">KSh {product.price}</span>
            </div>
            <p className="text-gray-500 text-sm">{product.description}</p>
          </div>

          <div className="flex items-center justify-between bg-orange-50 p-4 rounded-2xl">
            <span className="font-bold text-gray-700">Quantity</span>
            <div className="flex items-center space-x-6">
              <button 
                onClick={handleDecrement}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-orange-100 text-primary-600 active:scale-90"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-black text-gray-900 w-4 text-center">{quantity}</span>
              <button 
                onClick={handleIncrement}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-orange-100 text-primary-600 active:scale-90"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">M-Pesa Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">254</span>
                <input
                  type="tel"
                  placeholder="700 000 000"
                  className="w-full bg-gray-50 border border-orange-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="text-2xl font-black text-gray-900 underline decoration-primary-300 decoration-4">KSh {total}</span>
              </div>
              
              <button
                type="submit"
                disabled={loading || !phoneNumber}
                className="w-full btn-primary py-5 flex items-center justify-center space-x-3 text-lg font-bold shadow-xl shadow-primary-200"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    <span>Pay with M-Pesa</span>
                  </>
                )}
              </button>
            </div>
          </form>
          
          {status === 'error' && (
            <p className="text-center text-red-500 text-xs font-medium">
              Something went wrong. Please try again or use another number.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
