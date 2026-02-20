import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { LogIn, User, Lock, Mail, ArrowRight, Wine, Zap } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, register } = useAuthStore();
  const { triggerToast, selectedCategory } = useCartStore(); 
  const navigate = useNavigate();

  // Check if we are in Liquor Mode
  const isLiquorMode = selectedCategory === "Liquor";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isRegister) {
      const result = await register(username, email, password);
      if (result.success) {
        triggerToast("Account created! Logging you in...");
        const loginSuccess = await login(username, password);
        if (loginSuccess.success) navigate('/');
      } else {
        triggerToast(result.message);
      }
    } else {
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
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-700 px-6 py-12 ${
      isLiquorMode ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      
      {/* BACKGROUND DECOR (Liquor Mode Only) */}
      {isLiquorMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        </div>
      )}

      <div className={`relative z-10 p-8 md:p-12 rounded-[3rem] shadow-2xl w-full max-w-md border transition-all duration-500 ${
        isLiquorMode 
          ? 'bg-gray-900 border-gray-800 shadow-purple-500/5' 
          : 'bg-white border-gray-100 shadow-blue-200/50'
      }`}>
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl animate-in zoom-in duration-500 ${
            isLiquorMode 
              ? 'bg-purple-600 shadow-purple-500/40 text-white' 
              : 'bg-blue-600 shadow-blue-500/40 text-white'
          }`}>
            {isLiquorMode ? <Wine size={36} /> : <Zap size={36} />}
          </div>
          <h2 className={`text-4xl font-black tracking-tighter uppercase leading-none ${
            isLiquorMode ? 'text-white italic' : 'text-gray-900'
          }`}>
            {isRegister 
              ? (isLiquorMode ? "Join Jhyapp" : "Join Zapp") 
              : "Welcome Back"
            }
          </h2>
          <p className={`font-black text-[10px] tracking-[0.2em] mt-3 uppercase ${
            isLiquorMode ? 'text-purple-400/60' : 'text-gray-400'
          }`}>
            {isRegister ? "Create your new account" : "Login to your account"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className={`absolute left-5 top-1/2 -translate-y-1/2 ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
            <input 
              className={`w-full p-5 rounded-2xl border-none outline-none font-bold pl-14 transition-all text-sm ${
                isLiquorMode 
                  ? 'bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 placeholder:text-gray-600' 
                  : 'bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Username" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="relative animate-in slide-in-from-top-2 duration-300">
              <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
              <input 
                type="email"
                className={`w-full p-5 rounded-2xl border-none outline-none font-bold pl-14 transition-all text-sm ${
                  isLiquorMode 
                    ? 'bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 placeholder:text-gray-600' 
                    : 'bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500'
                }`}
                placeholder="Email Address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required={isRegister}
              />
            </div>
          )}

          <div className="relative">
            <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
            <input 
              type="password"
              className={`w-full p-5 rounded-2xl border-none outline-none font-bold pl-14 transition-all text-sm ${
                isLiquorMode 
                  ? 'bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 placeholder:text-gray-600' 
                  : 'bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={`w-full py-5 rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl mt-6 active:scale-95 flex items-center justify-center gap-2 group ${
            isLiquorMode 
              ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/20' 
              : 'bg-blue-600 text-white hover:bg-black shadow-blue-100'
          }`}>
            {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* TOGGLE SECTION */}
        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className={`font-bold text-xs uppercase tracking-widest transition-colors ${
              isLiquorMode ? 'text-gray-500 hover:text-purple-400' : 'text-gray-400 hover:text-blue-600'
            }`}
          >
            {isRegister ? (
              <span>Already have an account? <span className={isLiquorMode ? 'text-purple-500' : 'text-blue-600'}>Login</span></span>
            ) : (
              <span>New here? <span className={isLiquorMode ? 'text-purple-500' : 'text-blue-600'}>Create an account</span></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}