/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import axios from 'axios';

const backendURL = "http://127.0.0.1:8000";

export const useAuthStore = create((set, get) => ({
  // Load initial state from localStorage to persist login on refresh
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,

  // LOGIN ACTION
  login: async (username, password) => {
    try {
      // Hits Django's TokenObtainPairView
      const res = await axios.post(`${backendURL}/api/auth/login/`, { 
        username, 
        password 
      });
      
      const { access } = res.data;
      const userData = { username, is_staff: res.data.is_staff || false };

      // Persist to local storage
      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(userData));
      
      set({ token: access, user: userData });
      return { success: true };
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      // SimpleJWT returns errors in the 'detail' key
      return { 
        success: false, 
        message: err.response?.data?.detail || "Invalid username or password" 
      };
    }
  },

  // REGISTER ACTION
  register: async (username, email, password) => {
    try {
      // Hits your custom RegisterView
      const res = await axios.post(`${backendURL}/api/auth/register/`, { 
        username, 
        email, 
        password 
      });
      
      return { 
        success: true, 
        message: res.data.message || "Account created successfully!" 
      };
    } catch (err) {
      console.error("Registration Error:", err.response?.data);
      
      const serverErrors = err.response?.data;
      let errorMsg = "Registration failed";

      if (serverErrors) {
        if (typeof serverErrors === 'string') {
            errorMsg = serverErrors;
        } else if (serverErrors.error) {
            errorMsg = serverErrors.error;
        } else if (typeof serverErrors === 'object') {
            // Extracts the first error from the first field that failed (e.g., "username: already exists")
            const firstKey = Object.keys(serverErrors)[0];
            const firstVal = serverErrors[firstKey];
            errorMsg = Array.isArray(firstVal) ? `${firstKey}: ${firstVal[0]}` : `${firstKey}: ${firstVal}`;
        }
      }

      return { success: false, message: errorMsg };
    }
  },

  // LOGOUT ACTION
  logout: () => {
    // Clear Local Storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset Zustand State
    set({ token: null, user: null });
    
    // Redirect to home or login to clear any private data from memory
    window.location.href = '/';
  }
}));

/**
 * AXIOS INTERCEPTOR
 * Injects the JWT token into the header of every request.
 * We use localStorage directly here to ensure the latest token is always sent.
 */
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Handle 401 Unauthorized globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expires, log user out automatically
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);