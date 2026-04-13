import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Shirt, ClipboardList, LogOut
} from 'lucide-react';
import '../pages/Dashboard.css';

const menuItems = [
  { label: 'Dashboard',      icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Transactions',   icon: Package,         path: '/inventory' },
  { label: 'Rentals',        icon: Shirt,           path: '/rentals' },
  { label: 'Orders',         icon: ClipboardList,   path: '/orders' },
];

const Sidebar = ({ username }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem('stitchify-authenticated');
    localStorage.removeItem('stitchify-token');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1 className="brand-name">Stitchify</h1>
        <p className="brand-sub">Garments System</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(({ label, icon: Icon, path }) => (
          <button
            key={label}
            className={`sidebar-item${location.pathname === path ? ' active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {username && (
          <div className="sidebar-user">
            <p className="sidebar-user-label">Logged in as</p>
            <p className="sidebar-user-name">{username}</p>
          </div>
        )}
        <button className="signout-btn" onClick={handleSignOut}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
