import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LogIn from './pages/LogInSignUp/LogIn';
import Dashboard from './pages/Dashboard';
import Transaction from './pages/Transaction';
import Rentals from './pages/Rentals';
import Orders from './pages/Orders';

const isAuthenticated = () => localStorage.getItem('stitchify-authenticated') === 'true';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
      <Route path="/rentals"   element={<ProtectedRoute><Rentals /></ProtectedRoute>} />
      <Route path="/orders"    element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;