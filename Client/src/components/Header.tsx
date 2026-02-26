import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Settings, ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import type { Notification } from '../types';

const pageTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/students': 'Students',
    '/companies': 'Companies',
    '/internships': 'Internships',
};

interface HeaderProps {
    setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setSidebarCollapsed, setMobileOpen }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const pageTitle = pageTitles[location.pathname] || 'Dashboard';
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            {/* Left: breadcrumb + page title */}
            <div className="header-left">
                <button
                    className="sidebar-toggle-btn"
                    onClick={() => {
                        if (window.innerWidth <= 768) {
                            setMobileOpen(prev => !prev);
                        } else {
                            setSidebarCollapsed(prev => !prev);
                        }
                    }}
                    title="Toggle Sidebar"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <div className="header-breadcrumb">
                        <span className="breadcrumb-home" onClick={() => navigate('/')}>Dashboard</span>
                        {location.pathname !== '/' && (
                            <>
                                <ChevronRight size={14} className="breadcrumb-sep" />
                                <span className="breadcrumb-current">{pageTitle}</span>
                            </>
                        )}
                    </div>
                    <div className="header-page-title">
                        {pageTitle}
                    </div>
                </div>
            </div>

            {/* Right: actions */}
            <div className="header-right">
                {/* Notifications */}
                <div className="dropdown-container" ref={notifRef}>
                    <button
                        className="header-btn"
                        id="btn-notifications"
                        onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
                        title="Notifications"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && <span className="notification-badge" />}
                    </button>

                    {showNotif && (
                        <div className="dropdown-menu notif-dropdown">
                            <div className="dropdown-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h4>Notifications</h4>
                                    <p>{unreadCount} unread</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        style={{ fontSize: 11, color: 'var(--blue-600)', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            {notifications.map(notif => (
                                <div key={notif.id} className={`notif-item ${!notif.read ? 'unread' : ''}`}>
                                    <div className={`notif-dot ${notif.type}`} />
                                    <div className="notif-content">
                                        <p>{notif.message}</p>
                                        <span>{notif.time}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="notif-footer">
                                <button onClick={() => setShowNotif(false)}>View all notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="dropdown-container" ref={profileRef}>
                    <div
                        className="header-avatar"
                        id="btn-profile"
                        onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
                        title={user?.email}
                    >
                        {user?.avatar && user.avatar.startsWith('/') ? (
                            <img src={user.avatar} alt="Profile" className="avatar-img-round" />
                        ) : (
                            user?.avatar || 'AU'
                        )}
                    </div>

                    {showProfile && (
                        <div className="dropdown-menu">
                            <div className="dropdown-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                    <div className="header-avatar-large">
                                        {user?.avatar && user.avatar.startsWith('/') ? (
                                            <img src={user.avatar} alt="Profile" className="avatar-img-round" />
                                        ) : (
                                            user?.avatar || 'AU'
                                        )}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{user?.name}</h4>
                                        <p style={{ margin: 0, fontSize: 12 }}>{user?.role}</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: 12, opacity: 0.7 }}>{user?.email}</p>
                            </div>
                            <div className="dropdown-list">
                                <button className="dropdown-item">
                                    <User size={15} />
                                    My Profile
                                </button>
                                <button className="dropdown-item">
                                    <Settings size={15} />
                                    Settings
                                </button>
                                <div className="dropdown-divider" />
                                <button className="dropdown-item danger" onClick={handleLogout}>
                                    <LogOut size={15} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
