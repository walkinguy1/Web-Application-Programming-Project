import { create } from 'zustand';
import axios from 'axios';

const backendURL = "http://127.0.0.1:8000";

export const useCartStore = create((set) => ({
  cartCount: 0,
  user: JSON.parse(localStorage.getItem('user')) || null,
  showToast: false,
  toastMessage: "",
  
  // SEARCH STATE
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // CATEGORY STATE
  selectedCategory: "All", // Default category
  setCategory: (category) => set({ selectedCategory: category }),

  // AUTH ACTIONS
  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, cartCount: 0 });
  },

  // CART ACTIONS
  fetchCartCount: async () => {
    try {
      const res = await axios.get(`${backendURL}/api/cart/view/`);
      // Safely check if items exists before reducing
      const items = res.data.items || [];
      const total = items.reduce((acc, item) => acc + item.quantity, 0);
      set({ cartCount: total });
    } catch (err) {
      console.error("Cart fetch error:", err);
      set({ cartCount: 0 });
    }
  },
  updateCount: (newCount) => set({ cartCount: newCount }),
  
  // TOAST NOTIFICATIONS
  triggerToast: (message) => {
    set({ showToast: true, toastMessage: message });
    setTimeout(() => set({ showToast: false }), 3000);
  }
}));