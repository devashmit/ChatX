import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Lock, User, AlertCircle } from 'lucide-react';
import { getUsers, saveUser, hashPassword } from '../services/storageUtils';

export default function AuthPage({ onLoginSuccess, onBackToLanding }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleToggleMode = (mode) => {
    setIsLogin(mode);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const validateForm = () => {
    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return false;
    }
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError('Username must be between 3 and 20 alphanumeric characters (underscores allowed).');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const users = getUsers();
      const normalizedUsername = username.trim().toLowerCase();

      if (isLogin) {
        // Authenticate
        const user = users.find(u => u.username.toLowerCase() === normalizedUsername);
        if (!user) {
          setError('Invalid username or password.');
          setLoading(false);
          return;
        }

        const hashedVal = await hashPassword(password);
        if (user.passwordHash !== hashedVal) {
          setError('Invalid username or password.');
          setLoading(false);
          return;
        }

        // Success
        onLoginSuccess(user.username);
      } else {
        // Register
        const userExists = users.some(u => u.username.toLowerCase() === normalizedUsername);
        if (userExists) {
          setError('Username already taken.');
          setLoading(false);
          return;
        }

        const passwordHash = await hashPassword(password);
        const newUser = {
          username: username.trim(),
          passwordHash,
          createdAt: Date.now()
        };

        const success = saveUser(newUser);
        if (success) {
          onLoginSuccess(newUser.username);
        } else {
          setError('Failed to create account due to storage limits.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Decorative glows */}
      <div className="background-glows">
        <div className="glow-1" />
        <div className="glow-2" />
      </div>

      <button className="back-btn" onClick={onBackToLanding}>
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo">
            <MessageSquare size={32} />
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to access your chats' : 'Start your secure persona-driven chat experience'}
          </p>
        </div>

        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => handleToggleMode(true)}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => handleToggleMode(false)}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register & Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
