import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Building2, GraduationCap, LogOut, Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/students', icon: Users, label: 'Students' },
    { to: '/companies', icon: Building2, label: 'Companies' },
    { to: '/internships', icon: GraduationCap, label: 'Internships' },
];

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, mobileOpen, setMobileOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate('/login');
    };

    const handleNavClick = () => {
        if (window.innerWidth <= 768) {
            setMobileOpen(false);
        }
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <img src="/apt-logo.svg" alt="Logo" style={{ width: 24, height: 24 }} />
                </div>
                {!collapsed && (
                    <div className="sidebar-logo-text">
                        <h2>TVET IMS</h2>
                        <p>Internship Management</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {!collapsed && <div className="nav-section-title">Main Menu</div>}
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        title={collapsed ? item.label : ''}
                        onClick={handleNavClick}
                    >
                        <div className="nav-item-icon">
                            <item.icon size={18} />
                        </div>
                        {!collapsed && <span className="nav-item-label">{item.label}</span>}
                    </NavLink>
                ))}

                {!collapsed && (
                    <>
                        <div className="nav-section-title" style={{ marginTop: 16 }}>Settings</div>
                        <div className="nav-item" style={{ cursor: 'default', opacity: 0.5 }}>
                            <div className="nav-item-icon">
                                <Settings size={18} />
                            </div>
                            <span className="nav-item-label">Settings</span>
                            <span className="nav-item-badge">Soon</span>
                        </div>
                    </>
                )}
            </nav>

            {/* Footer user */}
            <div className="sidebar-footer">
                <div className="sidebar-user" onClick={handleLogout} title={collapsed ? `Logout (${user?.name})` : 'Logout'}>
                    <div className="sidebar-user-avatar">
                        {user?.avatar && user.avatar.startsWith('/') ? (
                            <img src={user.avatar} alt="Avatar" className="avatar-img" />
                        ) : (
                            user?.avatar || 'AU'
                        )}
                    </div>
                    {!collapsed && (
                        <div className="sidebar-user-info">
                            <h4>{user?.name}</h4>
                            <p>{user?.role}</p>
                        </div>
                    )}
                    {!collapsed && <LogOut size={15} style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }} />}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
