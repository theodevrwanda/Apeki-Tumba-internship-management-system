import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Users, X, User, Eye } from 'lucide-react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../api/client';
import type { Student } from '../types';
import toast from 'react-hot-toast';

interface FormData {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    level: string;
}

const emptyForm: FormData = { firstname: '', lastname: '', email: '', phone: '', level: '' };

const StudentsPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editing, setEditing] = useState<Student | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [viewTarget, setViewTarget] = useState<Student | null>(null);
    const [showView, setShowView] = useState(false);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getStudents();
            setStudents(res.data.data || []);
        } catch {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    const filtered = students.filter(s =>
        `${s.firstname} ${s.lastname} ${s.email} ${s.level}`.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (s: Student) => {
        setEditing(s);
        setForm({ firstname: s.firstname, lastname: s.lastname, email: s.email, phone: s.phone || '', level: s.level || '' });
        setShowModal(true);
    };
    const openDelete = (s: Student) => { setDeleteTarget(s); setShowDelete(true); };
    const openView = (s: Student) => { setViewTarget(s); setShowView(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstname || !form.lastname || !form.email) {
            toast.error('First name, last name, and email are required');
            return;
        }
        setSubmitting(true);
        try {
            if (editing) {
                await updateStudent(editing.student_id, form);
                toast.success('Student updated successfully');
            } else {
                await createStudent(form);
                toast.success('Student added successfully');
            }
            setShowModal(false);
            fetchStudents();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteStudent(deleteTarget.student_id);
            toast.success('Student deleted');
            setShowDelete(false);
            setDeleteTarget(null);
            fetchStudents();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <>
            <div className="animate-in">
                <div className="page-header">
                    <div className="page-header-info">
                        <h2>Students Management</h2>
                        <p>Manage all registered students in the system</p>
                    </div>
                    <button className="btn btn-primary btn-md" onClick={openAdd} id="btn-add-student">
                        <Plus size={16} /> Add Student
                    </button>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Users size={17} style={{ color: 'var(--blue-600)' }} />
                            <span className="card-title" style={{ fontWeight: 600, fontSize: 15 }}>
                                All Students
                                <span style={{ marginLeft: 8, background: 'var(--blue-100)', color: 'var(--blue-700)', fontSize: 12, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                                    {filtered.length}
                                </span>
                            </span>
                        </div>
                        <div className="search-bar">
                            <Search size={15} style={{ color: 'var(--gray-400)' }} />
                            <input
                                placeholder="Search students..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                id="search-students"
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
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Level</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6}>
                                                <div className="empty-state">
                                                    <div className="empty-state-icon">👩‍🎓</div>
                                                    <h4>No students found</h4>
                                                    <p>{search ? 'Try a different search term' : 'Add your first student to get started'}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filtered.map((s, i) => (
                                        <tr key={s.student_id}>
                                            <td style={{ color: 'var(--gray-400)', fontSize: 13 }}>{i + 1}</td>
                                            <td data-label="Student">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div className="student-avatar" style={{ fontSize: 11 }}>
                                                        {s.firstname[0]}{s.lastname[0]}
                                                    </div>
                                                    <div>
                                                        <div className="td-name">{s.firstname} {s.lastname}</div>
                                                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>ID: {s.student_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="Email" className="td-email">{s.email}</td>
                                            <td data-label="Phone">{s.phone || <span style={{ color: 'var(--gray-300)' }}>—</span>}</td>
                                            <td data-label="Level">
                                                {s.level ? (
                                                    <span style={{ background: 'var(--blue-50)', color: 'var(--blue-700)', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                                                        {s.level}
                                                    </span>
                                                ) : <span style={{ color: 'var(--gray-300)' }}>—</span>}
                                            </td>
                                            <td data-label="Actions">
                                                <div className="action-group">
                                                    <button className="action-btn edit" onClick={() => openView(s)} title="View Details" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}>
                                                        <Eye size={14} />
                                                    </button>
                                                    <button className="action-btn edit" onClick={() => openEdit(s)} title="Edit">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => openDelete(s)} title="Delete">
                                                        <Trash2 size={14} />
                                                    </button>
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
                                <div className="modal-icon"><User size={18} color="white" /></div>
                                {editing ? 'Edit Student' : 'Add New Student'}
                            </h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="modal-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>First Name *</label>
                                            <div className="form-input-wrap">
                                                <input className="form-input" style={{ paddingLeft: 14 }} placeholder="e.g. John"
                                                    value={form.firstname} onChange={e => setForm(f => ({ ...f, firstname: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name *</label>
                                            <div className="form-input-wrap">
                                                <input className="form-input" style={{ paddingLeft: 14 }} placeholder="e.g. Doe"
                                                    value={form.lastname} onChange={e => setForm(f => ({ ...f, lastname: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <div className="form-input-wrap">
                                            <input className="form-input" style={{ paddingLeft: 14 }} type="email" placeholder="e.g. john@email.com"
                                                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Phone</label>
                                            <div className="form-input-wrap">
                                                <input className="form-input" style={{ paddingLeft: 14 }} placeholder="e.g. +243 000 000 000"
                                                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Level / Class</label>
                                            <div className="form-input-wrap">
                                                <input className="form-input" style={{ paddingLeft: 14 }} placeholder="e.g. Level 3"
                                                    value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn-md" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-md" disabled={submitting}>
                                    {submitting ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : editing ? 'Update Student' : 'Add Student'}
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
                            <h4>Delete Student?</h4>
                            <p>Are you sure you want to delete <strong>{deleteTarget.firstname} {deleteTarget.lastname}</strong>? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary btn-md" onClick={() => setShowDelete(false)}>Cancel</button>
                            <button className="btn btn-danger btn-md" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {/* View Modal */}
            {showView && viewTarget && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowView(false); }}>
                    <div className="modal">
                        <div className="modal-header">
                            <h3>
                                <div className="modal-icon"><User size={18} color="white" /></div>
                                Student Information
                            </h3>
                            <button className="modal-close" onClick={() => setShowView(false)}><X size={16} /></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 20, borderBottom: '1px solid var(--gray-100)' }}>
                                    <div className="student-avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
                                        {viewTarget.firstname[0]}{viewTarget.lastname[0]}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>{viewTarget.firstname} {viewTarget.lastname}</h2>
                                        <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Student ID: #{viewTarget.student_id}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div className="info-item">
                                        <label style={{ display: 'block', fontSize: 12, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Email Address</label>
                                        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-700)' }}>{viewTarget.email}</div>
                                    </div>
                                    <div className="info-item">
                                        <label style={{ display: 'block', fontSize: 12, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Phone Number</label>
                                        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-700)' }}>{viewTarget.phone || 'N/A'}</div>
                                    </div>
                                    <div className="info-item">
                                        <label style={{ display: 'block', fontSize: 12, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Level / Class</label>
                                        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-700)' }}>
                                            <span style={{ background: 'var(--blue-50)', color: 'var(--blue-700)', padding: '2px 10px', borderRadius: 99 }}>
                                                {viewTarget.level || 'Not Specified'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-md" onClick={() => setShowView(false)}>Close View</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentsPage;
