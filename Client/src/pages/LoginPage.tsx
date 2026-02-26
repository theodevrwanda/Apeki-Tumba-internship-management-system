import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('example@gmail.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all fields.'); return; }
        setLoading(true);
        try {
            const ok = await login(email, password);
            if (ok) {
                navigate('/', { replace: true });
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-icon">
                        <img src="/apt-logo.svg" alt="APT Logo" style={{ width: 32, height: 32 }} />
                    </div>
                    <h1>APT TVET IMS</h1>
                    <p>Internship Management System</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="login-error">
                            <AlertCircle size={15} />
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="login-email">Email Address</label>
                        <div className="form-input-wrap">
                            <Mail size={16} className="input-icon" />
                            <input
                                id="login-email"
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <div className="form-input-wrap">
                            <Lock size={16} className="input-icon" />
                            <input
                                id="login-password"
                                type="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading} id="btn-login">
                        {loading ? (
                            <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</>
                        ) : (
                            <><LogIn size={17} /> Sign In</>
                        )}
                    </button>
                </form>

                <div className="login-hint" style={{ marginTop: 20 }}>
                    Demo: example@gmail.com / 1234567
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
