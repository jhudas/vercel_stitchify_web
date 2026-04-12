import React, { useState, useEffect } from 'react';
import { Bell, Plus, Pencil, Trash2, X, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './Inventory.css';

const API = 'http://localhost:5000/api/inventory';

const SERVICE_TYPES = ['All Services', 'rental', 'customization', 'printing'];

const STATUS_BADGE = {
  pending:      { bg: '#fffbeb', color: '#d97706' },
  'on process': { bg: '#eff6ff', color: '#3b82f6' },
  done:         { bg: '#f0fdf4', color: '#16a34a' },
};

const priceLabel = { rental: 'Rental', customization: 'Custom', printing: 'Print' };
const emptyForm  = { name: '', status: 'pending', serviceType: 'rental', quantity: '', price: '' };

const Inventory = () => {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [filter, setFilter]       = useState('All Services');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);

  // Fetch items
  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to load inventory');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const filtered = filter === 'All Services' ? items : items.filter(i => i.serviceType === filter);

  const openAdd  = () => { setEditItem(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, status: item.status, serviceType: item.serviceType, quantity: item.quantity, price: item.price }); setShowModal(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.status || !form.quantity || !form.price) return;
    setSaving(true);
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url    = editItem ? `${API}/${editItem._id}` : API;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quantity: Number(form.quantity), price: Number(form.price) }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'Save failed');
      }
      await fetchItems();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <header className="main-header">
          <h2 className="header-title">STITCHIFY</h2>
          <button className="bell-btn"><Bell size={18} /></button>
        </header>

        <div className="page-body">
          {/* Title row */}
          <div className="inv-title-row">
            <div>
              <h1 className="page-title">Inventory Management</h1>
              <p className="page-subtitle">Manage your garments and printing items</p>
            </div>
            <button className="add-item-btn" onClick={openAdd}>
              <Plus size={16} /> Add Item
            </button>
          </div>

          {/* Table card */}
          <div className="inv-card">
            <div className="inv-card-header">
              <h3 className="inv-card-title">Inventory Items</h3>
              <div className="inv-filter-wrap">
                <select className="inv-filter" value={filter} onChange={e => setFilter(e.target.value)}>
                  {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="inv-filter-icon" />
              </div>
            </div>

            <table className="inv-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Service Type</th>
                  <th>Quantity</th>
                  <th>Prices</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="inv-empty">Loading...</td></tr>
                )}
                {!loading && error && (
                  <tr><td colSpan={6} className="inv-empty inv-error">{error}</td></tr>
                )}
                {!loading && !error && filtered.map(item => {
                  const badge = STATUS_BADGE[item.status] || STATUS_BADGE.pending;
                  const svcBadge = {
                    rental:        { bg: '#eff6ff', color: '#3b82f6' },
                    customization: { bg: '#f5f3ff', color: '#7c3aed' },
                    printing:      { bg: '#f0fdf4', color: '#10b981' },
                  }[item.serviceType] || {};
                  return (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>
                        <span className="inv-badge" style={{ backgroundColor: badge.bg, color: badge.color }}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <span className="inv-badge" style={{ backgroundColor: svcBadge.bg, color: svcBadge.color }}>
                          {item.serviceType}
                        </span>
                      </td>
                      <td>{item.quantity}</td>
                      <td>₱{item.price}</td>
                      <td>
                        <div className="inv-actions">
                          <button className="inv-action-btn edit" onClick={() => openEdit(item)}>
                            <Pencil size={15} />
                          </button>
                          <button className="inv-action-btn delete" onClick={() => handleDelete(item._id)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && !error && filtered.length === 0 && (
                  <tr><td colSpan={6} className="inv-empty">No items found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editItem ? 'Edit Item' : 'Add Item'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {[
                { label: 'Item',      key: 'name',     type: 'text'   },
                { label: 'Quantity',  key: 'quantity', type: 'number' },
                { label: 'Price (₱)', key: 'price',    type: 'number' },
              ].map(({ label, key, type }) => (
                <div className="modal-field" key={key}>
                  <label>{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={label}
                  />
                </div>
              ))}
              <div className="modal-field">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="pending">Pending</option>
                  <option value="on process">On Process</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Service Type</label>
                <select value={form.serviceType} onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))}>
                  <option value="rental">Rental</option>
                  <option value="customization">Customization</option>
                  <option value="printing">Printing</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editItem ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
