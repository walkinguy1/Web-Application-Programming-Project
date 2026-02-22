/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { User, Mail, Calendar, Package, CheckCircle, Clock, XCircle, Edit3, Save, X, Hash, CreditCard, Wine } from 'lucide-react';
import backendURL from '../config';

const ORDER_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function OrderTimeline({ status, isLiquorMode }) {
  if (status === 'cancelled' || status === 'rejected') return (
    <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] mt-6 bg-rose-500/5 w-fit px-4 py-2 rounded-full border border-rose-500/20 text-rose-500`}>
      <XCircle size={14} /> Order {status}
    </div>
  );

  const currentStep = ORDER_STEPS.indexOf(status);
  const themeColor = isLiquorMode ? 'purple' : 'violet';

  return (
    <div className="relative mt-8 mb-4 px-2">
      <div className="flex justify-between relative">
        {ORDER_STEPS.map((step, i) => (
          <div key={step} className="z-10 flex flex-col items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-700 ${
              i <= currentStep
                ? isLiquorMode 
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] border-t border-purple-400/50 rotate-[-10deg]'
                  : 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border-t border-blue-400/50 rotate-[-10deg]'
                : 'bg-slate-900 border border-slate-800 text-slate-600'
            }`}>
              {i < currentStep ? <CheckCircle size={18} /> : <span className="font-black text-sm">{i + 1}</span>}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${
              i <= currentStep 
                ? (isLiquorMode ? 'text-purple-400' : 'text-blue-400') 
                : 'text-slate-600'
            }`}>
              {step}
            </span>
          </div>
        ))}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-800 -z-0" />
        <div 
          className={`absolute top-5 left-0 h-[2px] transition-all duration-1000 ease-in-out -z-0 ${
            isLiquorMode 
            ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 shadow-[0_0_15px_rgba(147,51,234,0.5)]' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]'
          }`}
          style={{ width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status, isLiquorMode }) {
  const baseStyles = "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md";
  const colors = {
    pending: isLiquorMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    processing: isLiquorMode ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    shipped: isLiquorMode ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return <span className={`${baseStyles} ${colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{status}</span>;
}

export default function Profile() {
  const { user } = useAuthStore();
  const { triggerToast, selectedCategory } = useCartStore();
  const navigate = useNavigate();

  const isLiquorMode = selectedCategory === "Liquor";

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
  }, [triggerToast]);

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
    <div className={`flex justify-center items-center min-h-[80vh] ${isLiquorMode ? 'bg-black' : 'bg-[#05060a]'}`}>
      <div className="relative">
        <div className={`w-16 h-16 border-4 rounded-full ${isLiquorMode ? 'border-purple-600/20' : 'border-blue-600/20'}`}></div>
        <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin absolute top-0 ${isLiquorMode ? 'border-purple-500' : 'border-blue-500'}`}></div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-700 pb-20 ${isLiquorMode ? 'bg-black text-white' : 'bg-[#05060a] text-white'}`}>
      <div className="max-w-5xl mx-auto px-6 pt-12 space-y-12">

        {/* ── PROFILE SECTION ── */}
        <section className="relative">
          <div className={`rounded-[3rem] border shadow-2xl p-10 relative overflow-hidden group transition-all duration-500 ${
            isLiquorMode ? 'bg-zinc-950 border-purple-900/30' : 'bg-[#0f111a] border-white/5'
          }`}>
            
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] transition-all duration-1000 ${
              isLiquorMode ? 'bg-purple-600/20 group-hover:bg-purple-500/30' : 'bg-blue-600/20 group-hover:bg-blue-500/30'
            }`} />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-8">
                {/* Avatar */}
                <div className="relative group">
                  <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500 border border-white/20 bg-gradient-to-br ${
                    isLiquorMode ? 'from-purple-900 via-zinc-900 to-black' : 'from-blue-600 via-indigo-700 to-purple-800'
                  }`}>
                    <span className={`text-4xl font-black italic ${isLiquorMode ? 'text-purple-400' : 'text-white'}`}>
                      {profile?.username?.[0] || 'U'}
                    </span>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 h-6 w-6 rounded-full border-4 shadow-lg ${
                    isLiquorMode ? 'bg-purple-500 border-zinc-950' : 'bg-emerald-500 border-[#0f111a]'
                  }`} />
                </div>

                <div>
                  <h1 className="text-4xl font-black tracking-tighter">
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : profile?.username}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-colors ${
                      isLiquorMode ? 'bg-purple-900/20 text-purple-400 border-purple-500/20' : 'bg-blue-600/10 text-blue-400 border-blue-500/20'
                    }`}>
                      @{profile?.username}
                    </span>
                    <span className="text-slate-500 text-xs font-bold flex items-center gap-1.5">
                      <Calendar size={14} /> Joined {profile?.date_joined}
                    </span>
                  </div>
                </div>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl active:scale-95 shrink-0 ${
                    isLiquorMode ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-white text-black hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 text-rose-400 font-black text-xs uppercase tracking-[0.15em] hover:bg-rose-500/10 transition-all shrink-0 border border-rose-500/20"
                >
                  <X size={16} /> Cancel
                </button>
              )}
            </div>

            {/* Info Grid */}
            <div className="mt-12">
              {!editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Email Address', val: profile?.email || 'Not provided', icon: Mail, color: isLiquorMode ? 'text-purple-400' : 'text-blue-400', bg: isLiquorMode ? 'bg-purple-500/10' : 'bg-blue-500/10' },
                    { label: 'Account Holder', val: profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'Setup Required', icon: User, color: isLiquorMode ? 'text-fuchsia-400' : 'text-indigo-400', bg: isLiquorMode ? 'bg-fuchsia-500/10' : 'bg-indigo-500/10' }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-5 border p-6 rounded-[2rem] transition-all ${isLiquorMode ? 'bg-black/60 border-purple-900/20 hover:border-purple-500/40' : 'bg-black/40 border-white/5 hover:bg-black/60'}`}>
                      <div className={`p-4 rounded-2xl border ${item.bg} ${item.color} border-current/10`}>
                        <item.icon size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{item.label}</p>
                        <p className="font-bold text-white text-lg truncate">{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      className={`w-full p-5 bg-black border rounded-2xl outline-none font-bold text-white transition-all ${isLiquorMode ? 'border-purple-900 focus:border-purple-500' : 'border-slate-800 focus:border-blue-500'}`}
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                    />
                    <input
                      className={`w-full p-5 bg-black border rounded-2xl outline-none font-bold text-white transition-all ${isLiquorMode ? 'border-purple-900 focus:border-purple-500' : 'border-slate-800 focus:border-blue-500'}`}
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                  <input
                    type="email"
                    className={`w-full p-5 bg-black border rounded-2xl outline-none font-bold text-white transition-all ${isLiquorMode ? 'border-purple-900 focus:border-purple-500' : 'border-slate-800 focus:border-blue-500'}`}
                    placeholder="Email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                  <button
                    onClick={handleSave}
                    className={`w-full py-6 rounded-[2rem] font-black text-sm tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3 mt-4 ${
                      isLiquorMode ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-900/40' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/40'
                    }`}
                  >
                    <Save size={20} /> UPDATE IDENTITY
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── ORDERS SECTION ── */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-4">
              {isLiquorMode ? <Wine size={28} className="text-purple-500" /> : <Package size={28} className="text-blue-500" />}
              {isLiquorMode ? "Reserve Vault" : "Purchase Vault"}
            </h2>
            <div className={`px-5 py-2 rounded-full border text-slate-400 font-black text-[10px] uppercase tracking-widest ${isLiquorMode ? 'bg-zinc-900 border-purple-900/30' : 'bg-slate-900 border-slate-800'}`}>
              {payments.length} Records
            </div>
          </div>

          {payments.length === 0 ? (
            <div className={`rounded-[3rem] border-2 border-dashed p-24 text-center ${isLiquorMode ? 'bg-zinc-950 border-purple-900/20' : 'bg-[#0f111a] border-slate-800/50'}`}>
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border rotate-12 ${isLiquorMode ? 'bg-zinc-900 border-purple-900/40' : 'bg-slate-900 border-slate-800'}`}>
                {isLiquorMode ? <Wine size={48} className="text-purple-900" /> : <Package size={48} className="text-slate-700" />}
              </div>
              <p className="text-slate-500 font-bold text-xl mb-8">The vault is currently empty.</p>
              <button
                onClick={() => navigate('/')}
                className={`px-12 py-5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-xl ${isLiquorMode ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
              >
                Acquire Gear
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {payments.map(payment => (
                <div key={payment.id} className={`rounded-[3rem] border shadow-sm p-8 transition-all group relative overflow-hidden ${
                  isLiquorMode ? 'bg-zinc-950 border-purple-900/20 hover:border-purple-500/30' : 'bg-[#0f111a] border-white/5 hover:border-blue-500/30'
                }`}>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl border ${isLiquorMode ? 'bg-black border-purple-900/40 text-purple-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                        <Hash size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Transaction Ref</p>
                        <p className={`font-black font-mono text-sm leading-none ${isLiquorMode ? 'text-purple-400' : 'text-blue-400'}`}>{payment.transaction_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 self-end lg:self-center">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Timestamp</p>
                        <p className="font-bold text-slate-200 text-xs">{payment.created_at}</p>
                      </div>
                      <StatusBadge status={payment.status} isLiquorMode={isLiquorMode} />
                    </div>
                  </div>

                  <div className={`rounded-[2rem] p-8 border mb-8 ${isLiquorMode ? 'bg-black/50 border-purple-900/20' : 'bg-black/30 border-white/5'}`}>
                    <OrderTimeline status={payment.status} isLiquorMode={isLiquorMode} />
                  </div>

                  <div className="space-y-4 mb-8">
                    {payment.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center group/item px-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full opacity-40 group-hover/item:opacity-100 transition-opacity ${isLiquorMode ? 'bg-purple-600' : 'bg-blue-600'}`} />
                          <span className="text-white font-black text-sm uppercase tracking-tight">{item.product_name}</span>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${isLiquorMode ? 'bg-purple-900/40 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>×{item.quantity}</span>
                        </div>
                        <span className="font-black text-slate-200 text-sm tracking-tighter">${item.item_total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isLiquorMode ? 'bg-purple-500/10 text-purple-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        <CreditCard size={16} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Settled via Gateway</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Total</span>
                      <span className="text-4xl font-black text-white tracking-tighter leading-none">
                        <span className={`text-xl mr-1 ${isLiquorMode ? 'text-purple-500' : 'text-blue-500'}`}>$</span>
                        {payment.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}