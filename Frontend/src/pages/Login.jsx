import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { LogIn, User, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, register } = useAuthStore();
  const { triggerToast } = useCartStore(); // Using the toast from your cart store
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isRegister) {
      // HANDLE REGISTRATION
      const result = await register(username, email, password);
      if (result.success) {
        triggerToast("Account created! Logging you in...");
        // Auto login after registration
        const loginSuccess = await login(username, password);
        if (loginSuccess.success) navigate('/');
      } else {
        triggerToast(result.message);
      }
    } else {
      // HANDLE LOGIN
      const result = await login(username, password);
      if (result.success) {
        triggerToast("Welcome back!");
        navigate('/');
      } else {
        triggerToast(result.message);
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-gray-100 transition-all">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200 animate-in zoom-in duration-500">
            <LogIn className="text-white" size={36} />
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase text-gray-900 leading-none">
            {isRegister ? "Join Zapp" : "Welcome Back"}
          </h2>
          <p className="text-gray-400 font-black text-[10px] tracking-[0.2em] mt-3 uppercase">
            {isRegister ? "Create your new account" : "Login to your account"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none font-bold pl-14 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="Username" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="relative animate-in slide-in-from-top-2 duration-300">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email"
                className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none font-bold pl-14 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                placeholder="Email Address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required={isRegister}
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password"
              className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none font-bold pl-14 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-100 mt-6 active:scale-95 flex items-center justify-center gap-2 group">
            {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* TOGGLE SECTION */}
        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            {isRegister ? (
              <span>Already have an account? <span className="text-blue-600">Login</span></span>
            ) : (
              <span>New here? <span className="text-blue-600">Create an account</span></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}