/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore'; // Added this import
import {
  DollarSign, Clock, CheckCircle, XCircle, Package,
  LayoutDashboard, ShoppingBag, CreditCard, Search,
  Pencil, Trash2, Plus, X, Save, ImageOff
} from 'lucide-react';

const backendURL = 'http://127.0.0.1:8000';

const CATEGORIES = ['Electronics', 'Jewelry', "Men's Clothing", "Women's Clothing", 'Liquor', 'Sale'];

const STATUS_COLORS = {
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  verified:   'bg-green-50 text-green-700 border-green-200',
  rejected:   'bg-red-50 text-red-600 border-red-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:    'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-600 border-red-200',
};

// Dark mode specific status colors for better visibility
const DARK_STATUS_COLORS = {
  pending:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  verified:   'bg-green-500/10 text-green-400 border-green-500/20',
  rejected:   'bg-red-500/10 text-red-400 border-red-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped:    'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered:  'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
};

function StatusBadge({ status, isLiquorMode }) {
  const colorClass = isLiquorMode ? DARK_STATUS_COLORS[status] : STATUS_COLORS[status];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${colorClass || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  );
}

const BLANK_PRODUCT = {
  title: '',
  description: '',
  price: '',
  category: 'Electronics',
  image: '',
};

function ProductsTab({ showToast, isLiquorMode }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(BLANK_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/products/`);
      setProducts(res.data);
    } catch {
      showToast('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(BLANK_PRODUCT);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(BLANK_PRODUCT);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.price || !form.category) {
      showToast('Title, price and category are required.');
      return;
    }
    setSaving(true);
    try {
      if (editingProduct) {
        await axios.put(`${backendURL}/api/products/update/${editingProduct.id}/`, form);
        showToast(`"${form.title}" updated.`);
      } else {
        await axios.post(`${backendURL}/api/products/create/`, form);
        showToast(`"${form.title}" created.`);
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendURL}/api/products/delete/${id}/`);
      showToast('Product deleted.');
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      showToast('Failed to delete product.');
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                isLiquorMode 
                ? 'bg-gray-900 border-gray-800 text-white focus:border-purple-500' 
                : 'bg-white border-gray-200 focus:border-blue-400'
              }`}
            />
          </div>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className={`px-4 py-2.5 rounded-xl border text-sm font-bold outline-none transition-all ${
              isLiquorMode 
              ? 'bg-gray-900 border-gray-800 text-white focus:border-purple-500' 
              : 'bg-white border-gray-200 text-gray-700 focus:border-blue-400'
            }`}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button
          onClick={openCreate}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all shrink-0 ${
            isLiquorMode ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-blue-600 text-white hover:bg-black'
          }`}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <p className={`text-xs font-bold uppercase tracking-widest ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
        {filterCategory !== 'All' && ` in ${filterCategory}`}
      </p>

      <div className={`rounded-[2rem] border shadow-sm overflow-hidden transition-all ${
        isLiquorMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
      }`}>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${isLiquorMode ? 'border-purple-500' : 'border-blue-600'}`} />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-left ${isLiquorMode ? 'border-gray-800' : 'border-gray-100'}`}>
                {['Image', 'Title', 'Category', 'Price', 'Rating', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold">No products found.</td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} className={`border-b transition-colors ${isLiquorMode ? 'border-gray-800/50 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className="px-6 py-3">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className={`w-12 h-12 object-contain rounded-xl border ${isLiquorMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`} onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${isLiquorMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                        <ImageOff size={16} className="text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <p className={`font-bold max-w-[200px] truncate ${isLiquorMode ? 'text-gray-200' : 'text-gray-900'}`}>{p.title}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${isLiquorMode ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className={`px-6 py-3 font-black ${isLiquorMode ? 'text-white' : 'text-gray-900'}`}>${parseFloat(p.price).toFixed(2)}</td>
                  <td className="px-6 py-3 font-bold text-gray-500">
                    {p.rating_rate > 0 ? `⭐ ${parseFloat(p.rating_rate).toFixed(1)}` : '—'}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className={`p-2 rounded-xl transition-all ${isLiquorMode ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`} title="Edit">
                        <Pencil size={14} />
                      </button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-red-500 transition-all">Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} className={`p-1.5 rounded-xl transition-all ${isLiquorMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}><X size={14} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(p.id)} className={`p-2 rounded-xl transition-all ${isLiquorMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'}`} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto ${isLiquorMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
            <div className={`flex items-center justify-between p-6 border-b ${isLiquorMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <h2 className="text-xl font-black tracking-tighter">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={closeModal} className={`p-2 rounded-xl transition-all ${isLiquorMode ? 'hover:bg-gray-800 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {form.image && (
                <div className={`w-full h-40 rounded-2xl border flex items-center justify-center overflow-hidden ${isLiquorMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                  <img src={form.image} alt="preview" className="max-h-full max-w-full object-contain" />
                </div>
              )}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Title *</label>
                <input className={`w-full p-3 rounded-xl outline-none font-bold text-sm border border-transparent ${isLiquorMode ? 'bg-gray-850 focus:ring-2 focus:ring-purple-500' : 'bg-gray-50 focus:ring-2 focus:ring-blue-500'}`} placeholder="Product title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Price *</label>
                  <input type="number" step="0.01" className={`w-full p-3 rounded-xl outline-none font-bold text-sm border border-transparent ${isLiquorMode ? 'bg-gray-850 focus:ring-2 focus:ring-purple-500' : 'bg-gray-50 focus:ring-2 focus:ring-blue-500'}`} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Category *</label>
                  <select className={`w-full p-3 rounded-xl outline-none font-bold text-sm border border-transparent ${isLiquorMode ? 'bg-gray-850 focus:ring-2 focus:ring-purple-500' : 'bg-gray-50 focus:ring-2 focus:ring-blue-500'}`} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Description</label>
                <textarea rows={4} className={`w-full p-3 rounded-xl outline-none font-bold text-sm border border-transparent resize-none ${isLiquorMode ? 'bg-gray-850 focus:ring-2 focus:ring-purple-500' : 'bg-gray-50 focus:ring-2 focus:ring-blue-500'}`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all disabled:opacity-50 ${isLiquorMode ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-blue-600 text-white hover:bg-black'}`}>
                  <Save size={16} /> {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button onClick={closeModal} className={`px-5 py-3 rounded-xl font-black text-sm transition-all ${isLiquorMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { selectedCategory } = useCartStore(); // Using the store to detect theme
  const isLiquorMode = selectedCategory === "Liquor";

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

  const verifiedRevenue = payments.filter(p => p.status === 'verified').reduce((a, p) => a + p.total_amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
    { id: 'payments',  label: `Payments${pendingPayments > 0 ? ` (${pendingPayments})` : ''}`, icon: CreditCard },
    { id: 'orders',    label: 'Orders',    icon: Package },
    { id: 'products',  label: 'Products',  icon: ShoppingBag },
  ];

  if (loading) return (
    <div className={`flex justify-center items-center min-h-screen transition-colors duration-500 ${isLiquorMode ? 'bg-gray-950' : 'bg-white'}`}>
      <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${isLiquorMode ? 'border-purple-500' : 'border-blue-600'}`}></div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-2xl border border-gray-800">
            {toast}
          </div>
        )}

        <div>
          <h1 className={`text-4xl font-black tracking-tighter uppercase ${isLiquorMode ? 'text-purple-400' : 'text-gray-900'}`}>Admin Dashboard</h1>
          <p className={`${isLiquorMode ? 'text-gray-500' : 'text-gray-400'} font-bold text-sm mt-1`}>Manage orders, payments and store operations</p>
        </div>

        <div className={`flex gap-2 border-b overflow-x-auto no-scrollbar ${isLiquorMode ? 'border-gray-900' : 'border-gray-100'}`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 font-black text-sm uppercase tracking-widest border-b-2 transition-all -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? (isLiquorMode ? 'border-purple-500 text-purple-400' : 'border-blue-600 text-blue-600')
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Verified Revenue', value: `$${verifiedRevenue.toFixed(2)}`, icon: DollarSign, color: isLiquorMode ? 'text-green-400' : 'text-green-500' },
                { label: 'Pending Payments', value: pendingPayments, icon: Clock, color: isLiquorMode ? 'text-yellow-400' : 'text-yellow-500' },
                { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: isLiquorMode ? 'text-purple-400' : 'text-blue-500' },
                { label: 'Delivered', value: deliveredOrders, icon: CheckCircle, color: isLiquorMode ? 'text-green-400' : 'text-green-500' },
              ].map(card => (
                <div key={card.label} className={`rounded-3xl border shadow-sm p-6 transition-all ${isLiquorMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                  <card.icon size={20} className={`${card.color} mb-3`} />
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`}>{card.label}</p>
                  <p className={`text-3xl font-black mt-1 ${isLiquorMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={`rounded-[2rem] border shadow-sm p-6 ${isLiquorMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <h3 className="font-black uppercase tracking-widest text-xs text-gray-500 mb-4">Latest Payments</h3>
                <div className="space-y-3">
                  {payments.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div>
                        <p className={`font-bold text-sm ${isLiquorMode ? 'text-gray-300' : 'text-gray-800'}`}>{p.username}</p>
                        <p className="text-xs text-gray-500 font-mono">{p.transaction_id}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-black ${isLiquorMode ? 'text-white' : 'text-gray-900'}`}>${p.total_amount.toFixed(2)}</p>
                        <StatusBadge status={p.status} isLiquorMode={isLiquorMode} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-[2rem] border shadow-sm p-6 ${isLiquorMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <h3 className="font-black uppercase tracking-widest text-xs text-gray-500 mb-4">Latest Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center justify-between">
                      <div>
                        <p className={`font-bold text-sm ${isLiquorMode ? 'text-gray-300' : 'text-gray-800'}`}>#{o.id} — {o.username}</p>
                        <p className="text-xs text-gray-500">{o.item_count} item{o.item_count !== 1 ? 's' : ''} · {o.created_at}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-black ${isLiquorMode ? 'text-white' : 'text-gray-900'}`}>${o.total_amount.toFixed(2)}</p>
                        <StatusBadge status={o.status} isLiquorMode={isLiquorMode} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className={`rounded-[2rem] border shadow-sm overflow-hidden ${isLiquorMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b text-left ${isLiquorMode ? 'border-gray-800' : 'border-gray-100'}`}>
                  {['User', 'Transaction ID', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className={`border-b transition-colors ${isLiquorMode ? 'border-gray-800/50 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 font-bold ${isLiquorMode ? 'text-gray-200' : 'text-gray-900'}`}>{p.username}</td>
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs">{p.transaction_id}</td>
                    <td className={`px-6 py-4 font-black ${isLiquorMode ? 'text-white' : 'text-gray-900'}`}>${p.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500 font-bold text-xs">{p.created_at}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} isLiquorMode={isLiquorMode} /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {p.status !== 'verified' && (
                          <button onClick={() => updatePaymentStatus(p.id, 'verified')} className={`px-3 py-1.5 text-white rounded-xl text-xs font-black transition-all ${isLiquorMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-green-600 hover:bg-green-500'}`}>Verify</button>
                        )}
                        <button onClick={() => updatePaymentStatus(p.id, 'rejected')} className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${isLiquorMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={`rounded-[2rem] border shadow-sm overflow-hidden ${isLiquorMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b text-left ${isLiquorMode ? 'border-gray-800' : 'border-gray-100'}`}>
                  {['Order #', 'User', 'Items', 'Total', 'Date', 'Status', 'Update Status'].map(h => (
                    <th key={h} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className={`border-b transition-colors ${isLiquorMode ? 'border-gray-800/50 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 font-black ${isLiquorMode ? 'text-purple-400' : 'text-gray-900'}`}>#{o.id}</td>
                    <td className={`px-6 py-4 font-bold ${isLiquorMode ? 'text-gray-200' : 'text-gray-900'}`}>{o.username}</td>
                    <td className="px-6 py-4 text-gray-500 font-bold">{o.item_count}</td>
                    <td className={`px-6 py-4 font-black ${isLiquorMode ? 'text-white' : 'text-gray-900'}`}>${o.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500 font-bold text-xs">{o.created_at}</td>
                    <td className="px-6 py-4"><StatusBadge status={o.status} isLiquorMode={isLiquorMode} /></td>
                    <td className="px-6 py-4">
                      <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} className={`px-3 py-2 rounded-xl border text-xs font-bold outline-none cursor-pointer transition-all ${isLiquorMode ? 'bg-gray-850 border-gray-700 text-white focus:border-purple-500' : 'bg-white border-gray-200 text-gray-700 focus:border-blue-400'}`}>
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

        {activeTab === 'products' && <ProductsTab showToast={showToast} isLiquorMode={isLiquorMode} />}
      </div>
    </div>
  );
}