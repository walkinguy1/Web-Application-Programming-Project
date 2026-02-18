import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register/', formData);
      alert("Account created! Now please login.");
      navigate('/login');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Check if username is taken or fields are empty.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <form onSubmit={handleRegister} className="bg-white p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase text-center text-gray-900">Join ZappStore</h2>
        <div className="space-y-4">
          <input
            className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none font-bold placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Username"
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          <input
            className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none font-bold placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Email Address"
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none font-bold placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Password"
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-blue-100 mt-4">
            CREATE ACCOUNT
          </button>
        </div>
        <p className="mt-8 text-center text-gray-400 font-bold text-sm">
          Already have an account? <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer hover:underline">Login here</span>
        </p>
      </form>
    </div>
  );
}