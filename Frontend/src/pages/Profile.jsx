/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { User, Mail, Calendar, Package, CheckCircle, Clock, XCircle, Edit3, Save, X } from 'lucide-react';

const backendURL = 'http://127.0.0.1:8000';

const ORDER_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function OrderTimeline({ status }) {
  if (status === 'cancelled') return (
    <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest mt-3">
      <XCircle size={14} /> Order Cancelled
    </div>
  );

  const currentStep = ORDER_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-1 mt-4">
      {ORDER_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all duration-500 ${
              i <= currentStep
                ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={`text-[9px] font-black uppercase whitespace-nowrap tracking-tighter ${
              i <= currentStep ? 'text-violet-400' : 'text-slate-500'
            }`}>
              {step}
            </span>
          </div>
          {i < ORDER_STEPS.length - 1 && (
            <div className={`h-[2px] flex-1 mb-4 transition-all duration-700 ${
              i < currentStep ? 'bg-violet-600' : 'bg-slate-800'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    verified:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected:   'bg-rose-500/10 text-rose-400 border-rose-500/20',
    pending:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
    processing: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    shipped:    'bg-violet-500/10 text-violet-400 border-violet-500/20',
    delivered:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled:  'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const icons = {
    verified:  <CheckCircle size={12} />,
    delivered: <CheckCircle size={12} />,
    rejected:  <XCircle size={12} />,
    cancelled: <XCircle size={12} />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border backdrop-blur-sm ${colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
      {icons[status] || <Clock size={12} />}
      {status}
    </span>
  );
}

export default function Profile() {
  const { user } = useAuthStore();
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

      {/* ── PROFILE CARD ── */}
      <div className="bg-[#0f111a] rounded-[2.5rem] border border-slate-800 shadow-2xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-[80px] -mr-16 -mt-16 group-hover:bg-violet-600/20 transition-all duration-700" />
        
        <div className="flex items-start justify-between mb-8 relative z-10">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-900/40 border border-violet-400/20">
              <span className="text-white text-3xl font-black uppercase tracking-widest">
                {profile?.username?.[0] || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white mb-1">
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile?.username}
              </h1>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                <p className="text-slate-400 text-sm font-bold tracking-wide">@{profile?.username}</p>
              </div>
            </div>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800/50 text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-violet-600 hover:text-white border border-slate-700 transition-all active:scale-95"
            >
              <Edit3 size={14} /> Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800/50 text-rose-400 font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white border border-slate-700 transition-all"
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>

        {/* Info view */}
        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 relative z-10">
            <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800/50 p-5 rounded-[1.5rem] hover:border-violet-500/30 transition-colors">
              <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Email</p>
                <p className="font-bold text-slate-200 text-sm truncate max-w-[150px]">{profile?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800/50 p-5 rounded-[1.5rem] hover:border-violet-500/30 transition-colors">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Full Name</p>
                <p className="font-bold text-slate-200 text-sm">
                  {profile?.first_name || profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`.trim()
                    : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800/50 p-5 rounded-[1.5rem] hover:border-violet-500/30 transition-colors">
              <div className="p-3 bg-fuchsia-500/10 rounded-xl text-fuchsia-400">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Joined</p>
                <p className="font-bold text-slate-200 text-sm">{profile?.date_joined}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Edit form */
          <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none font-bold text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="First Name"
                value={formData.first_name}
                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
              />
              <input
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none font-bold text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
            <input
              type="email"
              className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none font-bold text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              placeholder="Email Address"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <button
              onClick={handleSave}
              className="w-full bg-violet-600 text-white py-5 rounded-[1.5rem] font-black text-xs tracking-[0.2em] hover:bg-violet-500 shadow-lg shadow-violet-900/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Save size={16} /> CONFIRM CHANGES
            </button>
          </div>
        )}
      </div>

      {/* ── ORDER HISTORY ── */}
      <div>
        <h2 className="text-xl font-black tracking-[0.15em] uppercase text-white mb-6 flex items-center gap-3">
          <Package size={22} className="text-violet-500" /> 
          Order History
          <span className="text-xs font-bold text-slate-500 normal-case tracking-normal px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
            {payments.length} total
          </span>
        </h2>

        {payments.length === 0 ? (
          <div className="bg-[#0f111a] rounded-[2.5rem] border-2 border-dashed border-slate-800 p-20 text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
              <Package size={40} className="text-slate-700" />
            </div>
            <p className="text-slate-400 font-bold text-lg mb-6 tracking-tight">Your order list is empty.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-violet-600 hover:text-white transition-all active:scale-95"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map(payment => (
              <div key={payment.id} className="bg-[#0f111a] rounded-[2rem] border border-slate-800/80 shadow-sm p-7 hover:border-slate-700 transition-all group">

                {/* Order header */}
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Transaction Ref</p>
                    <p className="font-black text-slate-200 font-mono text-sm bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">{payment.transaction_id}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{payment.created_at}</p>
                    <StatusBadge status={payment.status} />
                  </div>
                </div>

                {/* Order tracking timeline */}
                <OrderTimeline status={payment.status} />

                {/* Items list */}
                <div className="space-y-3 mt-8 mb-6 bg-slate-900/30 p-5 rounded-2xl border border-slate-800/50">
                  {payment.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-black">{item.product_name}</span>
                        <span className="text-slate-500 font-black text-[10px] bg-slate-800 px-2 py-0.5 rounded">x{item.quantity}</span>
                      </div>
                      <span className="font-black text-slate-200">${item.item_total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center border-t border-slate-800/50 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Amount Settled</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-violet-400 tracking-tighter">${payment.total_amount.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}