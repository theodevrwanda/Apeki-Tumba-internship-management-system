import React, { useEffect, useState, useCallback } from 'react';
import { Users, Building2, GraduationCap, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { getStudents, getCompanies, getInternships } from '../api/client';
import type { Student, Company, Internship } from '../types';
import toast from 'react-hot-toast';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const cls =
        status === 'Ongoing' ? 'badge badge-ongoing' :
            status === 'Completed' ? 'badge badge-completed' :
                'badge badge-notstarted';
    return <span className={cls}>{status}</span>;
};

const CountUp: React.FC<{ to: number; duration?: number }> = ({ to, duration = 1200 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = Math.ceil(to / (duration / 30));
        const timer = setInterval(() => {
            start += step;
            if (start >= to) { setCount(to); clearInterval(timer); }
            else setCount(start);
        }, 30);
        return () => clearInterval(timer);
    }, [to, duration]);
    return <>{count}</>;
};

const DashboardPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('All');

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [sRes, cRes, iRes] = await Promise.all([
                getStudents(), getCompanies(), getInternships(),
            ]);
            setStudents(sRes.data.data || []);
            setCompanies(cRes.data.data || []);
            setInternships(iRes.data.data || []);
        } catch {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const ongoing = internships.filter(i => i.status === 'Ongoing').length;
    const completed = internships.filter(i => i.status === 'Completed').length;
    const notStarted = internships.filter(i => i.status === 'Not Started').length;

    const filteredInternships = filterStatus === 'All'
        ? internships
        : internships.filter(i => i.status === filterStatus);

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner" />
                <p className="loading-text">Loading dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="animate-in">
            {/* Stat Cards */}
            <div className="stats-grid">
                <div className="stat-card blue animate-in animate-delay-1">
                    <div className="stat-card-top">
                        <div className="stat-icon blue">
                            <Users size={22} color="white" />
                        </div>
                        <div className="stat-trend up">
                            <TrendingUp size={12} /> Live
                        </div>
                    </div>
                    <div className="stat-value">
                        <CountUp to={students.length} />
                    </div>
                    <div className="stat-label">Total Students</div>
                </div>

                <div className="stat-card indigo animate-in animate-delay-2">
                    <div className="stat-card-top">
                        <div className="stat-icon indigo">
                            <Building2 size={22} color="white" />
                        </div>
                        <div className="stat-trend up">
                            <TrendingUp size={12} /> Live
                        </div>
                    </div>
                    <div className="stat-value">
                        <CountUp to={companies.length} />
                    </div>
                    <div className="stat-label">Total Companies</div>
                </div>

                <div className="stat-card emerald animate-in animate-delay-3">
                    <div className="stat-card-top">
                        <div className="stat-icon emerald">
                            <GraduationCap size={22} color="white" />
                        </div>
                        <div className="stat-trend up">
                            <TrendingUp size={12} /> Live
                        </div>
                    </div>
                    <div className="stat-value">
                        <CountUp to={internships.length} />
                    </div>
                    <div className="stat-label">Total Internships</div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="quick-stats-grid">
                {[
                    { label: 'Ongoing', value: ongoing, icon: Clock, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
                    { label: 'Completed', value: completed, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                    { label: 'Not Started', value: notStarted, icon: AlertCircle, color: '#94a3b8', bg: 'rgba(148,163,184,0.08)' },
                ].map((item, i) => (
                    <div key={i} className="card animate-in" style={{ animationDelay: `${i * 0.05 + 0.2}s` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <item.icon size={18} color={item.color} />
                            </div>
                            <div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)' }}>{item.value}</div>
                                <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>{item.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Internship Summary Table */}
            <div className="card animate-in animate-delay-4">
                <div className="card-header">
                    <h3 className="card-title">
                        <GraduationCap size={18} style={{ color: 'var(--blue-600)' }} />
                        Internship Summary
                    </h3>
                    <div className="filter-tabs">
                        {['All', 'Ongoing', 'Completed', 'Not Started'].map(s => (
                            <button
                                key={s}
                                className={`filter-tab ${filterStatus === s ? 'active' : ''}`}
                                onClick={() => setFilterStatus(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="table-wrap">
                    <table className="internship-summary-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student Name</th>
                                <th>Company</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInternships.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            <div className="empty-state-icon">📋</div>
                                            <h4>No internships found</h4>
                                            <p>No internships match the selected filter</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredInternships.map((intern, idx) => (
                                    <tr key={intern.internship_id} style={{ animationDelay: `${idx * 0.03}s` }}>
                                        <td style={{ color: 'var(--gray-400)', fontSize: 13 }}>{idx + 1}</td>
                                        <td data-label="Student">
                                            <div className="student-cell">
                                                <div className="student-avatar">
                                                    {(intern.firstname?.[0] || '?')}{(intern.lastname?.[0] || '')}
                                                </div>
                                                <div>
                                                    <div className="td-name">{intern.firstname} {intern.lastname}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Company">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Building2 size={14} style={{ color: 'var(--blue-400)' }} />
                                                <span>{intern.company_name}</span>
                                            </div>
                                        </td>
                                        <td data-label="Start Date">{intern.start_date ? new Date(intern.start_date).toLocaleDateString('en-GB') : '—'}</td>
                                        <td data-label="End Date">{intern.end_date ? new Date(intern.end_date).toLocaleDateString('en-GB') : '—'}</td>
                                        <td data-label="Status"><StatusBadge status={intern.status} /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
