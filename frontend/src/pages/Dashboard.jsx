import { useState } from 'react';
import {
  Shirt, ClipboardList, CreditCard, CheckCircle, Bell
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

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
    <p className="sales-amount" style={{ color: amountColor }}>₱{amount.toFixed(2)}</p>
  </div>
);

const Dashboard = () => {
  const salesData = { rental: 2500.00, custom: 5000.00, printing: 0.00 };
  const totalRevenue = Object.values(salesData).reduce((a, b) => a + b, 0);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      {/* Main */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <h2 className="header-title">Choscemkyn Garments</h2>
          <button className="bell-btn">
            <Bell size={18} />
          </button>
        </header>

        {/* Page body */}
        <div className="page-body">
          <div className="page-heading">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of your business operations</p>
          </div>

          {/* Stat Cards */}
          <div className="stats-row">
            <StatCard title="Active Rentals"  count={0} icon={Shirt}         iconBg="#3b82f6" />
            <StatCard title="Pending Orders"  count={1} icon={ClipboardList} iconBg="#8b5cf6" />
            <StatCard title="Pending Debts"   count={1} icon={CreditCard}    iconBg="#ef4444" />
            <StatCard title="Ready Items"     count={1} icon={CheckCircle}   iconBg="#10b981" />
          </div>

          {/* Sales Summary */}
          <div className="sales-summary-box">
            <h3 className="sales-summary-title">Sales Summary</h3>
            <div className="sales-row">
              <SalesSummaryCard label="Rental Services"   amount={salesData.rental}   bg="#eff6ff" labelColor="#3b82f6"  amountColor="#0f172a" />
              <SalesSummaryCard label="Customization"     amount={salesData.custom}   bg="#f5f3ff" labelColor="#7c3aed"  amountColor="#0f172a" />
              <SalesSummaryCard label="Printing Services" amount={salesData.printing} bg="#f0fdf4" labelColor="#10b981"  amountColor="#0f172a" />
              <SalesSummaryCard label="Total Revenue"     amount={totalRevenue}       bg="#0f172a" labelColor="#94a3b8"  amountColor="#ffffff" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
