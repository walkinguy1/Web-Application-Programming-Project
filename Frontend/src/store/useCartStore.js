import { create } from 'zustand';
import axios from 'axios';
import backendURL from '../config';

const GUEST_CART_KEY = 'guest_cart';

// ── Guest cart helpers ────────────────────────────────────────────────────────
export function loadGuestCart() {
  try { return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || []; }
  catch { return []; }
}
export function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}
export function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

// ── Store ─────────────────────────────────────────────────────────────────────
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

  // ── FETCH CART ─────────────────────────────────────────────────────────────
  fetchCartCount: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Logged-in: fetch from server
      try {
        const res = await axios.get(`${backendURL}/api/cart/view/`);
        const items = res.data?.items || [];
        const totalQty = items.reduce((acc, i) => acc + (parseInt(i.quantity) || 0), 0);
        set({ cartItems: items, cartCount: totalQty });
      } catch (err) {
        console.error("Cart fetch error:", err);
        if (err.response?.status === 401) set({ cartCount: 0, cartItems: [] });
      }
    } else {
      // Guest: read from localStorage
      const items = loadGuestCart();
      const totalQty = items.reduce((acc, i) => acc + i.quantity, 0);
      set({ cartItems: items, cartCount: totalQty });
    }
  },

  fetchCart: async () => { await get().fetchCartCount(); },

  // ── ADD TO CART (guest only — logged-in users call API directly) ───────────
  addToCartGuest: (product, quantity = 1) => {
    const items = loadGuestCart();
    const existing = items.find(i => i.product_id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: Date.now(),
        product_id: product.id,
        product_name: product.title,
        product_price: parseFloat(product.price),
        product_image: product.image || '',
        quantity,
      });
    }
    items.forEach(i => { i.item_total = i.product_price * i.quantity; });
    saveGuestCart(items);
    const totalQty = items.reduce((acc, i) => acc + i.quantity, 0);
    set({ cartItems: items, cartCount: totalQty });
  },

  // ── SOURCE OF TRUTH FOR CHECKOUT ───────────────────────────────────────────
  getTotalPrice: () => {
    const items = get().cartItems || [];
    return items.reduce((acc, item) => {
      const price = parseFloat(item.product?.price || item.product_price || 0);
      return acc + price * (parseInt(item.quantity) || 0);
    }, 0);
  },

  // ── CLEAR CART ─────────────────────────────────────────────────────────────
  clearCart: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try { await axios.post(`${backendURL}/api/cart/clear/`); }
      catch (err) { console.error("Failed to clear server cart:", err); }
    } else {
      clearGuestCart();
    }
    set({ cartItems: [], cartCount: 0 });
  },

  updateCount: (newCount) => set({ cartCount: newCount }),

  // ── TOAST ──────────────────────────────────────────────────────────────────
  triggerToast: (message) => {
    set({ showToast: true, toastMessage: message });
    setTimeout(() => set({ showToast: false }), 3000);
  },
}));