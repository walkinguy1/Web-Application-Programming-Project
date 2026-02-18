/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, Users, Package } from 'lucide-react';

const backendURL = 'http://127.0.0.1:8000';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only allow staff/superusers — checked on backend too
    const fetchData = async () => {
      try {
        const [paymentsRes, ordersRes] = await Promise.all([
          axios.get(`${backendURL}/api/payments/all/`),
          axios.get(`${backendURL}/api/orders/all/`)
        ]);
        setPayments(paymentsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = payments
    .filter(p => p.status === 'verified')
    .reduce((acc, p) => acc + p.total_amount, 0);

  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const verifiedCount = payments.filter(p => p.status === 'verified').length;
  const rejectedCount = payments.filter(p => p.status === 'rejected').length;

  const statusColor = (status) => {
    if (status === 'verified' || status === 'delivered') return 'bg-green-50 text-green-700 border-green-100';
    if (status === 'rejected' || status === 'cancelled') return 'bg-red-50 text-red-600 border-red-100';
    return 'bg-yellow-50 text-yellow-700 border-yellow-100';
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">

      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-400 font-bold text-sm mt-1">Store overview and payment management</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <DollarSign size={20} className="text-green-500 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified Revenue</p>
          <p className="text-3xl font-black text-gray-900">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <Clock size={20} className="text-yellow-500 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pending</p>
          <p className="text-3xl font-black text-gray-900">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <CheckCircle size={20} className="text-blue-500 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified</p>
          <p className="text-3xl font-black text-gray-900">{verifiedCount}</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <XCircle size={20} className="text-red-400 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rejected</p>
          <p className="text-3xl font-black text-gray-900">{rejectedCount}</p>
        </div>
      </div>

      {/* RECENT PAYMENTS */}
      <div>
        <h2 className="text-xl font-black tracking-tighter uppercase text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign size={20} /> Recent Payments
        </h2>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-bold">No payments yet.</td></tr>
              ) : (
                payments.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{p.username}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">{p.transaction_id}</td>
                    <td className="px-6 py-4 font-black text-gray-900">${p.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-400 font-bold">{p.created_at}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div>
        <h2 className="text-xl font-black tracking-tighter uppercase text-gray-900 mb-4 flex items-center gap-2">
          <Package size={20} /> Recent Orders
        </h2>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order #</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Items</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-bold">No orders yet.</td></tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-black text-gray-900">#{o.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{o.username}</td>
                    <td className="px-6 py-4 text-gray-500 font-bold">{o.item_count} item{o.item_count !== 1 ? 's' : ''}</td>
                    <td className="px-6 py-4 font-black text-gray-900">${o.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}