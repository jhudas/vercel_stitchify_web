import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shirt } from 'lucide-react';
import MachineImg from '../../assets/Machine.png';
import './LogIn.css';

const LogIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('stitchify-authenticated') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!usernameOrEmail || !password || (!isLogin && !email)) {
      setError('Please fill in all required fields');
      return;
    }

    const url = `https://stitchify-backend.onrender.com/api/auth/${isLogin ? 'login' : 'register'}`;
    const payload = isLogin
      ? { username: usernameOrEmail, password }
      : { username: usernameOrEmail, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('stitchify-authenticated', 'true');

      if (data.token) {
        localStorage.setItem('stitchify-token', data.token);
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${MachineImg})` }}>
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-circle">
            <Shirt size={28} color="#fff" />
          </div>
          <h1 className="brand-name">Stitchify</h1>
          <p className="sub-brand">Inventory & Transaction Management</p>
        </div>

        <div className="tab-container">
          <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{isLogin ? 'Username or Email' : 'Username'}</label>
            <input
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder={isLogin ? 'Enter your username or email' : 'Choose a username'}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="submit-btn" type="submit">
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;