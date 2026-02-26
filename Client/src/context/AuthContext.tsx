import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { MOCK_USER, MOCK_CREDENTIALS } from '../data/mockData';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('tvet_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (err) {
                localStorage.removeItem('tvet_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
            setUser(MOCK_USER);
            localStorage.setItem('tvet_user', JSON.stringify(MOCK_USER));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tvet_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
