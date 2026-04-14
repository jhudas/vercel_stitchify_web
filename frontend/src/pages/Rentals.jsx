import { useState, useEffect } from 'react';
import { Bell, Plus, Pencil, Trash2, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import './Rentals.css';

const API = 'https://stitchify-backend.onrender.com/api/rentals';

const STATUS_STYLE = {
  active:   { bg: '#f0fdf4', color: '#16a34a' },
  returned: { bg: '#f8fafc', color: '#64748b' },
  overdue:  { bg: '#fef2f2', color: '#ef4444' },
};

const fmt = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const toInputDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
};

const emptyForm = { item: '', customer: '', contact: '', rentalDate: '', dueDate: '', price: '', status: 'active' };

const Rentals = () => {
  const [rentals, setRentals]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editRental, setEditRental] = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);

  const fetchRentals = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to load rentals');
      setRentals(await res.json());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRentals(); }, []);

  const openAdd  = () => { setEditRental(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (r) => {
    setEditRental(r);
    setForm({ item: r.item, customer: r.customer, contact: r.contact, rentalDate: toInputDate(r.rentalDate), dueDate: toInputDate(r.dueDate), price: r.price, status: r.status });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this rental?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setRentals(prev => prev.filter(r => r._id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleSave = async () => {
    if (!form.item || !form.customer || !form.contact || !form.rentalDate || !form.dueDate || !form.price) return;
    setSaving(true);
    try {
      const method = editRental ? 'PUT' : 'POST';
      const url    = editRental ? `${API}/${editRental._id}` : API;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Save failed'); }
      await fetchRentals();
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
              <h1 className="page-title">Rental Tracking</h1>
              <p className="page-subtitle">Manage garment rentals and track due dates</p>
            </div>
            <button className="add-item-btn" onClick={openAdd}><Plus size={16} /> New Rental</button>
          </div>
          <div className="inv-card">
            <div className="inv-card-header">
              <h3 className="inv-card-title">Active &amp; Past Rentals</h3>
            </div>
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Item</th><th>Customer</th><th>Contact</th>
                  <th>Rental Date</th><th>Due Date</th><th>Price</th>
                  <th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={8} className="inv-empty">Loading...</td></tr>}
                {!loading && error && <tr><td colSpan={8} className="inv-empty">{error}</td></tr>}
                {!loading && !error && rentals.map(r => {
                  const s = STATUS_STYLE[r.status] || STATUS_STYLE.active;
                  return (
                    <tr key={r._id}>
                      <td>{r.item}</td>
                      <td>{r.customer}</td>
                      <td>{r.contact}</td>
                      <td>{fmt(r.rentalDate)}</td>
                      <td>{fmt(r.dueDate)}</td>
                      <td>₱{r.price.toLocaleString()}</td>
                      <td><span className="inv-badge" style={{ backgroundColor: s.bg, color: s.color }}>{r.status}</span></td>
                      <td>
                        <div className="inv-actions">
                          <button className="inv-action-btn edit" onClick={() => openEdit(r)}><Pencil size={15} /></button>
                          <button className="inv-action-btn delete" onClick={() => handleDelete(r._id)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && !error && rentals.length === 0 && <tr><td colSpan={8} className="inv-empty">No rentals found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editRental ? 'Edit Rental' : 'New Rental'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {[
                { label: 'Item',        key: 'item',       type: 'text'   },
                { label: 'Customer',    key: 'customer',   type: 'text'   },
                { label: 'Contact',     key: 'contact',    type: 'text'   },
                { label: 'Rental Date', key: 'rentalDate', type: 'date'   },
                { label: 'Due Date',    key: 'dueDate',    type: 'date'   },
                { label: 'Price (₱)',   key: 'price',      type: 'number' },
              ].map(({ label, key, type }) => (
                <div className="modal-field" key={key}>
                  <label>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={label} />
                </div>
              ))}
              <div className="modal-field modal-field-full">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="returned">Returned</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editRental ? 'Save Changes' : 'Add Rental'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rentals;
