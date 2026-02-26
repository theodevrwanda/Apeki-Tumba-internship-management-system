import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    if (isLoading) {
        return (
            <div className="loading-spinner" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}
            <Sidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                mobileOpen={mobileMenuOpen}
                setMobileOpen={setMobileMenuOpen}
            />
            <div className="main-content">
                <Header
                    setSidebarCollapsed={setSidebarCollapsed}
                    setMobileOpen={setMobileMenuOpen}
                />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
