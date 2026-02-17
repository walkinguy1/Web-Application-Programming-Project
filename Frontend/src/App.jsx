import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Toast from './components/Toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-white flex flex-col">
        {/* Navbar stays at the top */}
        <Navbar />
        
        {/* The Toast is globally accessible and sits over the UI */}
        <Toast />

        {/* main flex-grow ensures footer stays at bottom even on short pages */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>

        {/* Footer stays at the bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;