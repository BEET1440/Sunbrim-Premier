import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import OrderTracking from './pages/OrderTracking'
import OrderHistory from './pages/OrderHistory'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Header from './components/Header'
import Footer from './components/Footer'
import { auth } from './firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

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
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/track" element={<OrderTracking user={user} />} />
            <Route path="/history" element={user ? <OrderHistory user={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}


export default App
