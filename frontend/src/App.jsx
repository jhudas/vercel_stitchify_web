import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './pages/LogInSignUp/LogIn';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Rentals from './pages/Rentals';

const isAuthenticated = () => localStorage.getItem('stitchify-authenticated') === 'true';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/rentals"   element={<ProtectedRoute><Rentals /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;