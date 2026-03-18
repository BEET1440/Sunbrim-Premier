import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import OrderTracking from './pages/OrderTracking'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simple mock user state for initial development
  useEffect(() => {
    const checkUser = async () => {
      // Firebase auth logic will go here
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        <main className="flex-grow container mx-auto px-4 py-6 max-w-md">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/track" element={<OrderTracking />} />
            <Route path="/login" element={<Login />} />
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
