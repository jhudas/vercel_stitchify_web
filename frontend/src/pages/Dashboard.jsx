import { useEffect, useState } from 'react';
import { Shirt, ClipboardList, CreditCard, CheckCircle, Bell } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

const API = 'https://stitchify-backend.onrender.com/api/dashboard/stats';

const StatCard = ({ title, count, icon: Icon, iconBg }) => (
  <div className="stat-card">
    <div className="stat-info">
      <p className="stat-title">{title}</p>
      <p className="stat-count">{count}</p>
    </div>
    <div className="stat-icon" style={{ backgroundColor: iconBg }}>
      <Icon size={26} color="#fff" />
    </div>
  </div>
);

const SalesSummaryCard = ({ label, amount, bg, labelColor, amountColor }) => (
  <div className="sales-card" style={{ backgroundColor: bg }}>
    <p className="sales-label" style={{ color: labelColor }}>{label}</p>
    <p className="sales-amount" style={{ color: amountColor }}>₱{Number(amount).toFixed(2)}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeRentals: 0,
    pendingOrders: 0,
    rentalRevenue: 0,
    customRevenue: 0,
    printRevenue:  0,
    totalRevenue:  0,
  });

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <h2 className="header-title">Choscemkyn Garments</h2>
          <button className="bell-btn"><Bell size={18} /></button>
        </header>

        <div className="page-body">
          <div className="page-heading">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of your business operations</p>
          </div>

          <div className="stats-row">
            <StatCard title="Active Rentals"  count={stats.activeRentals} icon={Shirt}         iconBg="#3b82f6" />
            <StatCard title="Pending Orders"  count={stats.pendingOrders} icon={ClipboardList} iconBg="#8b5cf6" />
            <StatCard title="Pending Debts"   count={0}                   icon={CreditCard}    iconBg="#ef4444" />
            <StatCard title="Ready Items"     count={0}                   icon={CheckCircle}   iconBg="#10b981" />
          </div>

          <div className="sales-summary-box">
            <h3 className="sales-summary-title">Sales Summary</h3>
            <div className="sales-row">
              <SalesSummaryCard label="Rental Services"   amount={stats.rentalRevenue} bg="#eff6ff" labelColor="#3b82f6" amountColor="#0f172a" />
              <SalesSummaryCard label="Customization"     amount={stats.customRevenue} bg="#f5f3ff" labelColor="#7c3aed" amountColor="#0f172a" />
              <SalesSummaryCard label="Printing Services" amount={stats.printRevenue}  bg="#f0fdf4" labelColor="#10b981" amountColor="#0f172a" />
              <SalesSummaryCard label="Total Revenue"     amount={stats.totalRevenue}  bg="#0f172a" labelColor="#94a3b8" amountColor="#ffffff" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
