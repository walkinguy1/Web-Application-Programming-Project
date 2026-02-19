import { create } from 'zustand';
import axios from 'axios';

const backendURL = "http://127.0.0.1:8000";

export const useCartStore = create((set, get) => ({
  cartItems: [], 
  cartCount: 0,
  showToast: false,
  toastMessage: "",
  
  // SEARCH STATE
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // CATEGORY STATE
  selectedCategory: "All",
  setCategory: (category) => set({ selectedCategory: category }),

  // SORT & FILTER STATE
  sortOrder: "",
  setSortOrder: (order) => set({ sortOrder: order }),
  minPrice: "",
  maxPrice: "",
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),

  // CART ACTIONS
  fetchCartCount: async () => {
    // We get the token directly from localStorage to ensure we're synced with AuthStore
    const token = localStorage.getItem('token');
    if (!token) {
      set({ cartItems: [], cartCount: 0 });
      return;
    }

    try {
      const res = await axios.get(`${backendURL}/api/cart/view/`);
      
      // Django might return items inside a data wrapper or as a direct list
      const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
      
      // Calculate total quantity
      const totalQty = items.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
      
      set({ 
        cartItems: items, 
        cartCount: totalQty 
      });
    } catch (err) {
      console.error("Cart fetch error:", err);
      // If the token is invalid/expired, we clear the cart locally
      if (err.response?.status === 401) {
        set({ cartCount: 0, cartItems: [] });
      }
    }
  },

  fetchCart: async () => {
    await get().fetchCartCount();
  },

  // This function is the "Source of Truth" for your Checkout total
  getTotalPrice: () => {
    const items = get().cartItems || [];
    if (items.length === 0) return 0;

    return items.reduce((acc, item) => {
      // Logic to handle both Django nested objects and local objects
      const rawPrice = item.product?.price || item.product_price || item.price || 0;
      const price = parseFloat(rawPrice) || 0;
      const qty = parseInt(item.quantity) || 0;
      return acc + (price * qty);
    }, 0);
  },

  clearCart: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Optional: Call backend to clear the database cart too
        await axios.post(`${backendURL}/api/cart/clear/`);
      } catch (err) {
        console.error("Failed to clear cart on server", err);
      }
    }
    set({ cartItems: [], cartCount: 0 });
  },

  updateCount: (newCount) => set({ cartCount: newCount }),
  
  // TOAST NOTIFICATIONS
  triggerToast: (message) => {
    set({ showToast: true, toastMessage: message });
    setTimeout(() => set({ showToast: false }), 3000);
  }
}));