import { create } from 'zustand';
import axios from 'axios';
import { loadGuestCart, clearGuestCart } from './useCartStore';
import backendURL from '../config';
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,

  // LOGIN
  login: async (username, password) => {
    try {
      console.log('Attempting login with username:', username);
      
      // ── Step 1: Snapshot the guest cart BEFORE login ──
      const guestItems = loadGuestCart().map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      // ── Step 2: Authenticate ──
      console.log('Sending login request to:', `${backendURL}/api/auth/login/`);
      const res = await axios.post(`${backendURL}/api/auth/login/`, { username, password });
      console.log('Login response received:', res.data);
      
      const { access } = res.data;
      const userData = { username, is_staff: res.data.is_staff || false };

      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(userData));
      set({ token: access, user: userData });
      console.log('Token and user stored. Token:', access.substring(0, 20) + '...');

      // ── Step 3: Merge guest cart into the user's server cart ──
      if (guestItems.length > 0) {
        try {
          await axios.post(
            `${backendURL}/api/cart/merge/`,
            { items: guestItems },
            { headers: { Authorization: `Bearer ${access}` } }
          );
          // Guest cart merged — clear it from localStorage
          clearGuestCart();
        } catch (mergeErr) {
          console.warn('Guest cart merge failed:', mergeErr);
        }
      }

      console.log('Login successful, returning success: true');
      return { success: true };
    } catch (err) {
      console.error("Login Error:", err);
      console.error("Error response:", err.response?.data);
      const message = err.response?.data?.detail || "Invalid username or password";
      console.log('Returning error:', message);
      return {
        success: false,
        message: message,
      };
    }
  },

  // REGISTER
  register: async (username, email, password) => {
    try {
      const res = await axios.post(`${backendURL}/api/auth/register/`, { username, email, password });
      return { success: true, message: res.data.message || "Account created successfully!" };
    } catch (err) {
      console.error("Registration Error:", err.response?.data);
      const serverErrors = err.response?.data;
      let errorMsg = "Registration failed";
      if (serverErrors) {
        if (typeof serverErrors === 'string') errorMsg = serverErrors;
        else if (serverErrors.error) errorMsg = serverErrors.error;
        else if (typeof serverErrors === 'object') {
          const firstKey = Object.keys(serverErrors)[0];
          const firstVal = serverErrors[firstKey];
          errorMsg = Array.isArray(firstVal) ? `${firstKey}: ${firstVal[0]}` : `${firstKey}: ${firstVal}`;
        }
      }
      return { success: false, message: errorMsg };
    }
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('wishlist_updated');
    set({ token: null, user: null });
    window.location.href = '/';
  },
}));

// Inject JWT into every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout on 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);