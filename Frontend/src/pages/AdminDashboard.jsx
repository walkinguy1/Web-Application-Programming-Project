/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Clock, CheckCircle, XCircle, Package, LayoutDashboard, ShoppingBag, CreditCard, ChevronDown } from 'lucide-react';

const backendURL = 'http://127.0.0.1:8000';

const STATUS_COLORS = {
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  verified:   'bg-green-50 text-green-700 border-green-200',
  rejected:   'bg-red-50 text-red-600 border-red-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:    'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-600 border-red-200',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${STATUS_COLORS[status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchData = async () => {
    try {
      const [paymentsRes, ordersRes] = await Promise.all([
        axios.get(`${backendURL}/api/payments/all/`),
        axios.get(`${backendURL}/api/orders/all/`)
      ]);
      setPayments(paymentsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      if (err.response?.status === 403) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updatePaymentStatus = async (id, status) => {
    setActionLoading(`payment-${id}`);
    try {
      await axios.patch(`${backendURL}/api/payments/${id}/status/`, { status });
      showToast(`Payment marked as ${status}`);
      fetchData();
    } catch {
      showToast('Failed to update payment');
    } finally {
      setActionLoading(null);
    }
  };

  const updateOrderStatus = async (id, status) => {
    setActionLoading(`order-${id}`);
    try {
      await axios.patch(`${backendURL}/api/orders/${id}/status/`, { status });
      showToast(`Order #${id} updated to ${status}`);
      fetchData();
    } catch {
      showToast('Failed to update order');
    } finally {
      setActionLoading(null);
    }
  };

  // Stats
  const verifiedRevenue = payments.filter(p => p.status === 'verified').reduce((a, p) => a + p.total_amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'payments', label: `Payments ${pendingPayments > 0 ? `(${pendingPayments} pending)` : ''}`, icon: CreditCard },
    { id: 'orders', label: 'Orders', icon: Package },
  ];

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl animate-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-400 font-bold text-sm mt-1">Manage orders, payments and store operations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 font-black text-sm uppercase tracking-widest border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Verified Revenue', value: `$${verifiedRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
              { label: 'Pending Payments', value: pendingPayments, icon: Clock, color: 'text-yellow-500' },
              { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-blue-500' },
              { label: 'Delivered', value: deliveredOrders, icon: CheckCircle, color: 'text-green-500' },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <card.icon size={20} className={`${card.color} mb-3`} />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{card.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Recent activity split */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
              <h3 className="font-black uppercase tracking-widest text-xs text-gray-400 mb-4">Latest Payments</h3>
              <div className="space-y-3">
                {payments.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-gray-800">{p.username}</p>
                      <p className="text-xs text-gray-400 font-mono">{p.transaction_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">${p.total_amount.toFixed(2)}</p>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
                {payments.length === 0 && <p className="text-gray-400 font-bold text-sm">No payments yet.</p>}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
              <h3 className="font-black uppercase tracking-widest text-xs text-gray-400 mb-4">Latest Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-gray-800">#{o.id} — {o.username}</p>
                      <p className="text-xs text-gray-400">{o.item_count} item{o.item_count !== 1 ? 's' : ''} · {o.created_at}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">${o.total_amount.toFixed(2)}</p>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-gray-400 font-bold text-sm">No orders yet.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENTS TAB ── */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                {['User', 'Transaction ID', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold">No payments yet.</td></tr>
              ) : payments.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{p.username}</td>
                  <td className="px-6 py-4 font-mono text-gray-500 text-xs">{p.transaction_id}</td>
                  <td className="px-6 py-4 font-black text-gray-900">${p.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-400 font-bold text-xs">{p.created_at}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {p.status !== 'verified' && (
                        <button
                          onClick={() => updatePaymentStatus(p.id, 'verified')}
                          disabled={actionLoading === `payment-${p.id}`}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-xl text-xs font-black hover:bg-green-500 transition-all disabled:opacity-50"
                        >
                          Verify
                        </button>
                      )}
                      {p.status !== 'rejected' && (
                        <button
                          onClick={() => updatePaymentStatus(p.id, 'rejected')}
                          disabled={actionLoading === `payment-${p.id}`}
                          className="px-3 py-1.5 bg-red-100 text-red-600 rounded-xl text-xs font-black hover:bg-red-200 transition-all disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                {['Order #', 'User', 'Items', 'Total', 'Date', 'Status', 'Update Status'].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-bold">No orders yet.</td></tr>
              ) : orders.map(o => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-black text-gray-900">#{o.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{o.username}</td>
                  <td className="px-6 py-4 text-gray-500 font-bold">{o.item_count}</td>
                  <td className="px-6 py-4 font-black text-gray-900">${o.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-400 font-bold text-xs">{o.created_at}</td>
                  <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-6 py-4">
                    <select
                      value={o.status}
                      disabled={actionLoading === `order-${o.id}`}
                      onChange={e => updateOrderStatus(o.id, e.target.value)}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none focus:border-blue-400 cursor-pointer disabled:opacity-50 bg-white"
                    >
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}