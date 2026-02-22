import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Toast from './components/Toast';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
// NEW: Import the ContactUs page
import ContactUs from './pages/Contactus'; 
import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';

// HELPER: Auto-scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const { token } = useAuthStore();
  
  // Pull the selectedCategory to determine the theme
  const { selectedCategory } = useCartStore();
  const isLiquorMode = selectedCategory === "Liquor";

  return (
    <Router>
      <ScrollToTop />
      
      {/* Dynamic Theme Container */}
      <div className={`min-h-screen w-full flex flex-col font-sans antialiased transition-colors duration-700 ease-in-out ${
        isLiquorMode 
          ? 'bg-gray-950 text-white' // Night Theme
          : 'bg-white text-gray-900' // Day Theme
      }`}>
        
        {/* Persistent UI Elements */}
        <Navbar />
        <Toast />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* NEW: Added the route for Contact Us */}
            <Route path="/contact" element={<ContactUs />} />

            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={!token ? <Login /> : <Navigate to="/" />} 
            />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

            {/* Protected Routes */}
            <Route 
              path="/checkout" 
              element={token ? <Checkout /> : <Navigate to="/login" replace />} 
            />
            <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />

            <Route path="/admin-dashboard" element={token ? <AdminDashboard /> : <Navigate to="/login" replace />} />

            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-20">
                  <h1 className={`text-9xl font-black transition-colors ${isLiquorMode ? 'text-gray-800' : 'text-gray-100'}`}>404</h1>
                  <p className="text-xl font-bold text-gray-400 -mt-8 uppercase tracking-widest">
                    Page Not Found
                  </p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className={`mt-6 px-8 py-3 rounded-2xl font-bold transition-all ${
                      isLiquorMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-blue-600 hover:bg-black'
                    } text-white`}
                  >
                    Back to Home
                  </button>
                </div>
              } 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;