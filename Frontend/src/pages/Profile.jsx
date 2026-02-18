/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { User, Mail, Calendar, Package, CheckCircle, Clock, XCircle, Edit3, Save, X } from 'lucide-react';

const backendURL = 'http://127.0.0.1:8000';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const { triggerToast } = useCartStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, paymentsRes] = await Promise.all([
          axios.get(`${backendURL}/api/profile/`),
          axios.get(`${backendURL}/api/payments/history/`)
        ]);
        setProfile(profileRes.data);
        setFormData({
          first_name: profileRes.data.first_name || '',
          last_name: profileRes.data.last_name || '',
          email: profileRes.data.email || '',
        });
        setPayments(paymentsRes.data);
      } catch (err) {
        triggerToast('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSave = async () => {
    try {
      const res = await axios.patch(`${backendURL}/api/profile/update/`, formData);
      setProfile(prev => ({ ...prev, ...res.data }));
      setEditing(false);
      triggerToast('Profile updated!');
    } catch (err) {
      triggerToast('Update failed. Please try again.');
    }
  };

  const statusIcon = (status) => {
    if (status === 'verified') return <CheckCircle size={14} className="text-green-500" />;
    if (status === 'rejected') return <XCircle size={14} className="text-red-400" />;
    return <Clock size={14} className="text-yellow-500" />;
  };

  const statusColor = (status) => {
    if (status === 'verified') return 'bg-green-50 text-green-700 border-green-100';
    if (status === 'rejected') return 'bg-red-50 text-red-600 border-red-100';
    return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">

      {/* PROFILE CARD */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white text-2xl font-black uppercase">
                {profile?.username?.[0] || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-gray-900">
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile?.username}
              </h1>
              <p className="text-gray-400 text-sm font-bold">@{profile?.username}</p>
            </div>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all"
            >
              <Edit3 size={15} /> Edit
            </button>
          ) : (
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <X size={15} /> Cancel
            </button>
          )}
        </div>

        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
                <p className="font-bold text-gray-800 text-sm">{profile?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
              <User size={16} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</p>
                <p className="font-bold text-gray-800 text-sm">
                  {profile?.first_name || profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`.trim()
                    : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
              <Calendar size={16} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Member Since</p>
                <p className="font-bold text-gray-800 text-sm">{profile?.date_joined}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="First Name"
                value={formData.first_name}
                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
              />
              <input
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
            <input
              type="email"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Email Address"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              <Save size={16} /> SAVE CHANGES
            </button>
          </div>
        )}
      </div>

      {/* ORDER HISTORY */}
      <div>
        <h2 className="text-2xl font-black tracking-tighter uppercase text-gray-900 mb-4 flex items-center gap-3">
          <Package size={22} /> Order History
          <span className="text-base font-bold text-gray-400 normal-case tracking-normal">
            ({payments.length} order{payments.length !== 1 ? 's' : ''})
          </span>
        </h2>

        {payments.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-16 text-center">
            <Package size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">No orders yet.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-blue-600 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map(payment => (
              <div key={payment.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction ID</p>
                    <p className="font-black text-gray-900 font-mono">{payment.transaction_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{payment.created_at}</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase border mt-1 ${statusColor(payment.status)}`}>
                      {statusIcon(payment.status)} {payment.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {payment.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-600">
                      <span className="font-bold">{item.product_name} <span className="text-gray-400 font-medium">x{item.quantity}</span></span>
                      <span className="font-black text-gray-800">${item.item_total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Paid</span>
                  <span className="text-xl font-black text-blue-600">${payment.total_amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}