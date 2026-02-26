import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Building2, X, MapPin, Phone, User } from 'lucide-react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../api/client';
import type { Company } from '../types';
import toast from 'react-hot-toast';

interface FormData {
    company_name: string;
    address: string;
    email: string;
    supervisor_name: string;
    supervisor_phone: string;
}

const emptyForm: FormData = { company_name: '', address: '', email: '', supervisor_name: '', supervisor_phone: '' };

const CompaniesPage: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editing, setEditing] = useState<Company | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCompanies();
            setCompanies(res.data.data || []);
        } catch {
            toast.error('Failed to load companies');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

    const filtered = companies.filter(c =>
        `${c.company_name} ${c.address} ${c.supervisor_name}`.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (c: Company) => {
        setEditing(c);
        setForm({ company_name: c.company_name, address: c.address || '', email: c.email || '', supervisor_name: c.supervisor_name || '', supervisor_phone: c.supervisor_phone || '' });
        setShowModal(true);
    };
    const openDelete = (c: Company) => { setDeleteTarget(c); setShowDelete(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.company_name) { toast.error('Company name is required'); return; }
        setSubmitting(true);
        try {
            if (editing) {
                await updateCompany(editing.company_id, form);
                toast.success('Company updated successfully');
            } else {
                await createCompany(form);
                toast.success('Company added successfully');
            }
            setShowModal(false);
            fetchCompanies();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteCompany(deleteTarget.company_id);
            toast.success('Company deleted');
            setShowDelete(false);
            setDeleteTarget(null);
            fetchCompanies();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <>
            <div className="animate-in">
                <div className="page-header">
                    <div className="page-header-info">
                        <h2>Companies Management</h2>
                        <p>Manage all partner companies and host organizations</p>
                    </div>
                    <button className="btn btn-primary btn-md" onClick={openAdd} id="btn-add-company">
                        <Plus size={16} /> Add Company
                    </button>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Building2 size={17} style={{ color: 'var(--blue-600)' }} />
                            <span className="card-title" style={{ fontWeight: 600, fontSize: 15 }}>
                                All Companies
                                <span style={{ marginLeft: 8, background: 'var(--blue-100)', color: 'var(--blue-700)', fontSize: 12, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                                    {filtered.length}
                                </span>
                            </span>
                        </div>
                        <div className="search-bar">
                            <Search size={15} style={{ color: 'var(--gray-400)' }} />
                            <input
                                placeholder="Search companies..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                id="search-companies"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-spinner"><div className="spinner" /><p className="loading-text">Loading...</p></div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Company Name</th>
                                        <th>Address</th>
                                        <th>Email</th>
                                        <th>Supervisor</th>
                                        <th>Supervisor Phone</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6}>
                                                <div className="empty-state">
                                                    <div className="empty-state-icon">🏢</div>
                                                    <h4>No companies found</h4>
                                                    <p>{search ? 'Try a different search term' : 'Add your first company to get started'}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filtered.map((c, i) => (
                                        <tr key={c.company_id}>
                                            <td style={{ color: 'var(--gray-400)', fontSize: 13 }}>{i + 1}</td>
                                            <td data-label="Company">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{
                                                        width: 34, height: 34, borderRadius: 8,
                                                        background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
                                                    }}>
                                                        {c.company_name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="td-name">{c.company_name}</div>
                                                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>ID: {c.company_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="Address">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <MapPin size={13} style={{ color: 'var(--gray-400)' }} />
                                                    <span style={{ fontSize: 13 }}>{c.address || <span style={{ color: 'var(--gray-300)' }}>—</span>}</span>
                                                </div>
                                            </td>
                                            <td data-label="Email">
                                                <span style={{ fontSize: 13 }}>{c.email || <span style={{ color: 'var(--gray-300)' }}>—</span>}</span>
                                            </td>
                                            <td data-label="Supervisor">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <User size={13} style={{ color: 'var(--gray-400)' }} />
                                                    <span>{c.supervisor_name || <span style={{ color: 'var(--gray-300)' }}>—</span>}</span>
                                                </div>
                                            </td>
                                            <td data-label="Phone">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Phone size={13} style={{ color: 'var(--gray-400)' }} />
                                                    <span style={{ fontSize: 13 }}>{c.supervisor_phone || <span style={{ color: 'var(--gray-300)' }}>—</span>}</span>
                                                </div>
                                            </td>
                                            <td data-label="Actions">
                                                <div className="action-group">
                                                    <button className="action-btn edit" onClick={() => openEdit(c)} title="Edit"><Edit2 size={14} /></button>
                                                    <button className="action-btn delete" onClick={() => openDelete(c)} title="Delete"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3>
                                <div className="modal-icon"><Building2 size={18} color="white" /></div>
                                {editing ? 'Edit Company' : 'Add New Company'}
                            </h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="modal-form">
                                    <div className="form-group">
                                        <label>Company Name *</label>
                                        <div className="form-input-wrap">
                                            <input className="form-input" style={{ paddingLeft: 14 }} placeholder="e.g. TechCorp Ltd."
                                                value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <div className="form-input-wrap">
                                            <input className="form-input" style={{ paddingLeft: 14 }} placeholder="e.g. 123 Main St, Kigali"
                                                value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Company Email</label>
                                        <div className="form-input-wrap">
                                            <input className="form-input" style={{ paddingLeft: 14 }} type="email" placeholder="e.g. contact@techcorp.rw"
                                                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Supervisor Name</label>
                                            <div className="form-input-wrap">
                                                <input className="form-input" style={{ paddingLeft: 14 }} placeholder="e.g. Jean Dupont"
                                                    value={form.supervisor_name} onChange={e => setForm(f => ({ ...f, supervisor_name: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Supervisor Phone</label>
                                            <div className="form-input-wrap">
                                                <input className="form-input" style={{ paddingLeft: 14 }} placeholder="e.g. +243 000 000"
                                                    value={form.supervisor_phone} onChange={e => setForm(f => ({ ...f, supervisor_phone: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn-md" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-md" disabled={submitting}>
                                    {submitting ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : editing ? 'Update Company' : 'Add Company'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {showDelete && deleteTarget && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowDelete(false); }}>
                    <div className="modal confirm-modal">
                        <div className="modal-header">
                            <h3>
                                <div className="modal-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
                                    <Trash2 size={18} color="white" />
                                </div>
                                Confirm Delete
                            </h3>
                            <button className="modal-close" onClick={() => setShowDelete(false)}><X size={16} /></button>
                        </div>
                        <div className="confirm-body">
                            <div className="confirm-icon-wrap">
                                <Trash2 size={28} color="#ef4444" />
                            </div>
                            <h4>Delete Company?</h4>
                            <p>Are you sure you want to delete <strong>{deleteTarget.company_name}</strong>? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary btn-md" onClick={() => setShowDelete(false)}>Cancel</button>
                            <button className="btn btn-danger btn-md" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CompaniesPage;
