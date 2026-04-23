import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5001/api';
import { 
  Zap, Shield, Rocket, ArrowRight, UserPlus, Mail, Lock, 
  Eye, EyeOff, ShieldCheck, RefreshCcw, LogIn, KeyRound, 
  ArrowLeft, ShieldAlert 
} from 'lucide-react';

// --- HOME PAGE COMPONENT ---
const Home = () => (
  <div className="min-vh-100 d-flex flex-column">
    <nav>
      <div className="logo" style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-1px' }}>
        <Zap size={28} className="text-primary" style={{ marginRight: '8px' }} />
        NEOPULSE
      </div>
      <ul className="nav-links">
        <li><Link to="/">Solutions</Link></li>
        <li><Link to="/">Pricing</Link></li>
        <li><Link to="/">About</Link></li>
      </ul>
      <div>
        <Link to="/login" className="btn" style={{ color: 'white', marginRight: '16px' }}>Login</Link>
        <Link to="/signup" className="btn btn-primary">Get Started</Link>
      </div>
    </nav>

    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5%' }}>
      <div className="text-center" style={{ maxWidth: '900px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <span style={{ 
            background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '8px 16px', 
            borderRadius: '100px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>Now in Private Beta</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: '800', lineHeight: 1.1, marginTop: '24px', marginBottom: '24px' }}>
            Authentication for the <span style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Modern Web</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '600px', marginInline: 'auto' }}>
            Secure, scalable, and stunningly simple. The next generation of identity management is here.
          </p>
          <div className="d-flex justify-content-center gap-4">
            <Link to="/signup" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Start Building Free <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '80px', textAlign: 'left' }}>
          {[
            { icon: <Shield />, title: 'Ironclad Security', desc: 'Enterprise-grade encryption for every user session.' },
            { icon: <Zap />, title: 'Instant Setup', desc: 'Deploy your entire auth system in under 5 minutes.' },
            { icon: <Rocket />, title: 'Global Scale', desc: 'Built on a globally distributed network for zero latency.' }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="glass-container" style={{ padding: '32px' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>

    <footer style={{ padding: '40px 8%', borderTop: '1px solid var(--glass-border)', marginTop: '80px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
      &copy; 2026 NeoPulse Authentication. All rights reserved.
    </footer>
  </div>
);

// --- SIGNUP COMPONENT ---
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) return 'Please fill in all fields';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password });
      setSuccess(response.data.message);
      localStorage.setItem('pendingEmail', email);
      setTimeout(() => navigate('/verify'), 2000);
    } catch (err) {
      console.error('Signup error:', err);
      const msg = err.response?.data?.message || 'Something went wrong. Check your connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-container auth-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="btn-primary" style={{ width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <UserPlus size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Join the NeoPulse community today</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ 
              background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--error)', 
              padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', color: 'var(--error)'
            }}>
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ 
              background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--success)', 
              padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', color: 'var(--success)'
            }}>
              {success} Redirecting...
            </motion.div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" className={`form-input ${error.includes('email') ? 'error' : ''}`} placeholder="name@example.com" style={{ paddingLeft: '48px' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" className={`form-input ${error.includes('Password') ? 'error' : ''}`} placeholder="••••••••" style={{ paddingLeft: '48px' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '54px' }} disabled={loading}>
            {loading ? (
              <RefreshCcw size={20} className="spinner" />
            ) : (
              <>Continue <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

// --- VERIFY OTP COMPONENT ---
const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('pendingEmail');
    if (!savedEmail) {
      navigate('/signup');
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.some(d => d === '')) return setError('Please enter the full 6-digit code');
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/verify-otp`, { 
        email, 
        otp: otp.join('') 
      });
      setSuccess(response.data.message);
      localStorage.removeItem('pendingEmail');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Full Verification Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Network error: Backend not reachable';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-container auth-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="btn-primary" style={{ width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Verify Identity</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            We've sent a 6-digit code to <br />
            <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify}>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ 
              textAlign: 'center', color: 'var(--error)', marginBottom: '20px', 
              fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' 
            }}>
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ 
              textAlign: 'center', color: 'var(--success)', marginBottom: '20px', 
              fontSize: '0.9rem', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px' 
            }}>
              {success}
            </motion.div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '32px' }}>
            {otp.map((d, i) => (
              <input 
                key={i} 
                id={`otp-${i}`} 
                type="text" 
                inputMode="numeric"
                className="form-input" 
                style={{ width: '50px', height: '60px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '700', padding: 0 }} 
                value={d} 
                onChange={(e) => handleChange(e, i)} 
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '54px' }} disabled={loading}>
            {loading ? <RefreshCcw size={20} className="spinner" /> : 'Verify Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Didn't receive the code? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Try again</Link>
        </p>
      </motion.div>
    </div>
  );
};

// --- LOGIN PAGE (DUMMY) ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-container auth-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <LogIn size={48} className="text-primary" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Welcome Back</h2>
        </div>
        
        {success ? (
          <div style={{ textAlign: 'center', color: 'var(--success)', padding: '20px' }}>
            <ShieldCheck size={48} style={{ marginBottom: '16px' }} />
            <p>Login successful! Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">Password</label>
                <Link to="/forgot" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot?</Link>
              </div>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '54px' }} disabled={loading}>
              {loading ? <RefreshCcw size={20} className="spinner" /> : 'Sign In'}
            </button>
          </form>
        )}
        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)' }}>
          New here? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Create account</Link>
        </p>
      </div>
    </div>
  );
};

// --- FORGOT PASSWORD (DUMMY) ---
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-container auth-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <KeyRound size={48} className="text-primary" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Forgot Password</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Enter your email to receive reset instructions</p>
        </div>
        
        {success ? (
          <div style={{ textAlign: 'center', color: 'var(--success)', padding: '20px' }}>
             <Mail size={48} style={{ marginBottom: '16px' }} />
             <p>Check your inbox! We've sent instructions to {email}.</p>
             <Link to="/login" className="btn btn-primary" style={{ marginTop: '20px', textDecoration: 'none' }}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '54px' }} disabled={loading}>
              {loading ? <RefreshCcw size={20} className="spinner" /> : 'Send Reset Link'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// --- RESET PASSWORD (DUMMY) ---
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-container auth-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <ShieldAlert size={48} className="text-secondary" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Reset Password</h2>
        </div>
        
        {success ? (
          <div style={{ textAlign: 'center', color: 'var(--success)', padding: '20px' }}>
             <ShieldCheck size={48} style={{ marginBottom: '16px' }} />
             <p>Password updated successfully! Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" placeholder="••••••••" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" placeholder="••••••••" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '54px' }} disabled={loading}>
              {loading ? <RefreshCcw size={20} className="spinner" /> : 'Set New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyOTP />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
