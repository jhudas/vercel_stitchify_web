import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, X, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './Inventory.css';

const API = 'https://stitchify-backend.onrender.com/api/orders';

const TYPE_BADGE = {
  customization: { bg: '#f5f3ff', color: '#7c3aed' },
  printing:      { bg: '#f0fdf4', color: '#10b981' },
};

const STATUS_STYLE = {
  pending:     { bg: '#fffbeb', color: '#d97706' },
  'in progress': { bg: '#eff6ff', color: '#3b82f6' },
  completed:   { bg: '#f0fdf4', color: '#16a34a' },
  cancelled:   { bg: '#fef2f2', color: '#ef4444' },
};

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '';
const toInputDate = (d) => d ? new Date(d).toISOString().split('T')[0] : '';

const emptyForm = { type: 'customization', customer: '', contact: '', description: '', qty: '', price: '', dueDate: '', status: 'pending' };

const Orders = () => {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);

  const fetchOrders = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to load orders');
      setOrders(await res.json());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const openAdd  = () => { setEditOrder(null); setForm(emptyForm); setShowModal(true); };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleSave = async () => {
    if (!form.customer || !form.contact || !form.description || !form.qty || !form.price || !form.dueDate) return;
    setSaving(true);
    try {
      const method = editOrder ? 'PUT' : 'POST';
      const url    = editOrder ? `${API}/${editOrder._id}` : API;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, qty: Number(form.qty), price: Number(form.price) }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Save failed'); }
      await fetchOrders();
      setShowModal(false);
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <h2 className="header-title">Choscemkyn Garments</h2>
          <button className="bell-btn"><Bell size={18} /></button>
        </header>

        <div className="page-body">
          <div className="inv-title-row">
            <div>
              <h1 className="page-title">Order Management</h1>
              <p className="page-subtitle">Track customization and printing orders</p>
            </div>
            <button className="add-item-btn" onClick={openAdd}>
              <Plus size={16} /> New Order
            </button>
          </div>

          <div className="inv-card">
            <div className="inv-card-header">
              <h3 className="inv-card-title">All Orders</h3>
            </div>
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Customer</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={8} className="inv-empty">Loading...</td></tr>}
                {!loading && error && <tr><td colSpan={8} className="inv-empty">{error}</td></tr>}
                {!loading && !error && orders.map(o => {
                  const tb = TYPE_BADGE[o.type] || {};
                  const ss = STATUS_STYLE[o.status] || STATUS_STYLE.pending;
                  return (
                    <tr key={o._id}>
                      <td><span className="inv-badge" style={{ backgroundColor: tb.bg, color: tb.color }}>{o.type}</span></td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{o.customer}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{o.contact}</div>
                      </td>
                      <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.description}</td>
                      <td>{o.qty}</td>
                      <td>₱{o.price.toLocaleString()}</td>
                      <td>{fmt(o.dueDate)}</td>
                      <td>
                        <div className="order-status-wrap">
                          <span className="inv-badge" style={{ backgroundColor: ss.bg, color: ss.color }}>{o.status}</span>
                          <div className="inv-filter-wrap" style={{ marginLeft: '6px' }}>
                            <select
                              className="inv-filter"
                              value={o.status}
                              onChange={e => handleStatusChange(o._id, e.target.value)}
                              style={{ padding: '4px 24px 4px 8px', fontSize: '12px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <ChevronDown size={12} className="inv-filter-icon" />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="inv-actions">
                          <button className="inv-action-btn delete" onClick={() => handleDelete(o._id)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && !error && orders.length === 0 && (
                  <tr><td colSpan={8} className="inv-empty">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Order</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {[
                { label: 'Customer',     key: 'customer',    type: 'text'   },
                { label: 'Contact',      key: 'contact',     type: 'text'   },
                { label: 'Qty',          key: 'qty',         type: 'number' },
                { label: 'Price (₱)',    key: 'price',       type: 'number' },
                { label: 'Due Date',     key: 'dueDate',     type: 'date'   },
              ].map(({ label, key, type }) => (
                <div className="modal-field" key={key}>
                  <label>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={label} />
                </div>
              ))}
              <div className="modal-field modal-field-full">
                <label>Description</label>
                <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" />
              </div>
              <div className="modal-field">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="customization">Customization</option>
                  <option value="printing">Printing</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Add Order'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
