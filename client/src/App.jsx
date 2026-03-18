import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

// Lazy load pages for performance and low bandwidth
const Home = lazy(() => import('./pages/Home'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const OrderHistory = lazy(() => import('./pages/OrderHistory'))
const Admin = lazy(() => import('./pages/Admin'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    <span className="text-[10px] font-bold text-primary-600 animate-pulse uppercase tracking-widest">Loading...</span>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Simple Offline Sync Logic
  useEffect(() => {
    const syncOfflineOrders = async () => {
      if (navigator.onLine) {
        const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
        if (offlineOrders.length > 0) {
          console.log(`Syncing ${offlineOrders.length} offline orders...`);
          // Here you would normally call your createOrder function for each
          // For now, we'll just clear it once online as a demo of the flow
          // localStorage.removeItem('offline_orders');
        }
      }
    };

    window.addEventListener('online', syncOfflineOrders);
    return () => window.removeEventListener('online', syncOfflineOrders);
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-bold text-primary-600 animate-pulse uppercase tracking-widest">SunbrimPremier</span>
    </div>
  );

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        <main className="flex-grow container mx-auto px-4 py-6 max-w-md">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/track" element={<OrderTracking user={user} />} />
              <Route path="/history" element={user ? <OrderHistory user={user} /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  )
}



export default App
