import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, GraduationCap, X, Calendar, Building2, Download, Eye, Clock, User } from 'lucide-react';
import StatusBadge from '../components/Common/StatusBadge';
import { getInternships, getStudents, getCompanies, createInternship, updateInternship, deleteInternship } from '../api/client';
import type { Internship, Student, Company } from '../types';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FormData {
    student_id: string;
    company_id: string;
    start_date: string;
    end_date: string;
    status: string;
}

const emptyForm: FormData = { student_id: '', company_id: '', start_date: '', end_date: '', status: 'Not Started' };


const InternshipsPage: React.FC = () => {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [editing, setEditing] = useState<Internship | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Internship | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [viewTarget, setViewTarget] = useState<Internship | null>(null);
    const [showView, setShowView] = useState(false);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [iRes, sRes, cRes] = await Promise.all([getInternships(), getStudents(), getCompanies()]);
            setInternships(iRes.data.data || []);
            setStudents(sRes.data.data || []);
            setCompanies(cRes.data.data || []);
        } catch {
            toast.error('Failed to load internships');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const filtered = internships.filter(i => {
        const matchSearch = `${i.firstname} ${i.lastname} ${i.company_name}`.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || i.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (i: Internship) => {
        setEditing(i);
        setForm({
            student_id: String(i.student_id),
            company_id: String(i.company_id),
            start_date: i.start_date ? i.start_date.split('T')[0] : '',
            end_date: i.end_date ? i.end_date.split('T')[0] : '',
            status: i.status,
        });
        setShowModal(true);
    };
    const openDelete = (i: Internship) => { setDeleteTarget(i); setShowDelete(true); };
    const openView = (i: Internship) => { setViewTarget(i); setShowView(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.student_id || !form.company_id || !form.start_date || !form.end_date) {
            toast.error('All required fields must be filled');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                student_id: Number(form.student_id),
                company_id: Number(form.company_id),
                start_date: form.start_date,
                end_date: form.end_date,
                status: form.status,
            };
            if (editing) {
                await updateInternship(editing.internship_id, payload);
                toast.success('Internship updated successfully');
            } else {
                await createInternship(payload);
                toast.success('Internship created successfully');
            }
            setShowModal(false);
            fetchAll();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteInternship(deleteTarget.internship_id);
            toast.success('Internship deleted');
            setShowDelete(false);
            setDeleteTarget(null);
            fetchAll();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB') : '—';

    const generatePDF = () => {
        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(20);
        doc.setTextColor(59, 130, 246); // Blue-500
        doc.text('TVET Internship Management System', 105, 15, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text('Internship Assignments Report', 105, 25, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 32, { align: 'center' });

        // Add Table
        const tableData = filtered.map((intern, idx) => [
            String(idx + 1),
            `${intern.firstname || ''} ${intern.lastname || ''}`,
            String(intern.company_name || ''),
            String(fmtDate(intern.start_date)),
            String(fmtDate(intern.end_date)),
            String(intern.status || '')
        ]);

        autoTable(doc, {
            head: [['#', 'Student Name', 'Company', 'Start Date', 'End Date', 'Status']],
            body: tableData,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [249, 250, 251] },
        });

        doc.save(`internship_report_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('Report generated successfully');
    };

    // Filter students: those who DON'T have an internship yet
    // PLUS the currently being edited student (so they stay in the list)
    const availableStudents = students.filter(s => {
        const isAssigned = internships.some(i => i.student_id === s.student_id);
        if (editing && editing.student_id === s.student_id) return true;
        return !isAssigned;
    });

    return (
        <>
            <div className="animate-in">
                <div className="page-header">
                    <div className="page-header-info">
                        <h2>Internships Management</h2>
                        <p>Track and manage all student internship assignments</p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-secondary btn-md" onClick={generatePDF}>
                            <Download size={16} /> Generate Report
                        </button>
                        <button className="btn btn-primary btn-md" onClick={openAdd} id="btn-add-internship">
                            <Plus size={16} /> Add Internship
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <GraduationCap size={17} style={{ color: 'var(--blue-600)' }} />
                            <span className="card-title" style={{ fontWeight: 600, fontSize: 15 }}>
                                All Internships
                                <span style={{ marginLeft: 8, background: 'var(--blue-100)', color: 'var(--blue-700)', fontSize: 12, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                                    {filtered.length}
                                </span>
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                            <div className="filter-tabs">
                                {['All', 'Ongoing', 'Completed', 'Not Started'].map(s => (
                                    <button key={s} className={`filter-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
                                ))}
                            </div>
                            <div className="search-bar">
                                <Search size={15} style={{ color: 'var(--gray-400)' }} />
                                <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} id="search-internships" />
                            </div>
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
                                        <th>Student</th>
                                        <th>Company</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7}>
                                                <div className="empty-state">
                                                    <div className="empty-state-icon">🎓</div>
                                                    <h4>No internships found</h4>
                                                    <p>{search ? 'Try a different search term' : 'Create your first internship assignment'}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filtered.map((intern, idx) => (
                                        <tr key={intern.internship_id}>
                                            <td style={{ color: 'var(--gray-400)', fontSize: 13 }}>{idx + 1}</td>
                                            <td data-label="Student">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div className="student-avatar" style={{ fontSize: 11 }}>
                                                        {(intern.firstname?.[0] || '?')}{(intern.lastname?.[0] || '')}
                                                    </div>
                                                    <div className="td-name">{intern.firstname} {intern.lastname}</div>
                                                </div>
                                            </td>
                                            <td data-label="Company">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Building2 size={13} style={{ color: 'var(--blue-400)' }} />
                                                    <span>{intern.company_name}</span>
                                                </div>
                                            </td>
                                            <td data-label="Start Date">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Calendar size={13} style={{ color: 'var(--gray-400)' }} />
                                                    {fmtDate(intern.start_date)}
                                                </div>
                                            </td>
                                            <td data-label="End Date">{fmtDate(intern.end_date)}</td>
                                            <td data-label="Status"><StatusBadge status={intern.status} /></td>
                                            <td data-label="Actions">
                                                <div className="action-group">
                                                    <button className="action-btn edit" onClick={() => openView(intern)} title="View Details" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}>
                                                        <Eye size={14} />
                                                    </button>
                                                    <button className="action-btn edit" onClick={() => openEdit(intern)} title="Edit"><Edit2 size={14} /></button>
                                                    <button className="action-btn delete" onClick={() => openDelete(intern)} title="Delete"><Trash2 size={14} /></button>
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
                                <div className="modal-icon"><GraduationCap size={18} color="white" /></div>
                                {editing ? 'Edit Internship' : 'Add New Internship'}
                            </h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="modal-form">
                                    <div className="form-group">
                                        <label>Student *</label>
                                        <div className="form-input-wrap">
                                            <select className="form-input" style={{ paddingLeft: 14 }}
                                                value={form.student_id}
                                                onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))}>
                                                <option value="">— Select a student —</option>
                                                {availableStudents.map(s => (
                                                    <option key={s.student_id} value={s.student_id}>
                                                        {s.firstname} {s.lastname}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Company *</label>
                                        <div className="form-input-wrap">
                                            <select className="form-input" style={{ paddingLeft: 14 }}
                                                value={form.company_id}
                                                onChange={e => setForm(f => ({ ...f, company_id: e.target.value }))}>
                                                <option value="">— Select a company —</option>
                                                {companies.map(c => (
                                                    <option key={c.company_id} value={c.company_id}>
                                                        {c.company_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Start Date *</label>
                                            <div className="form-input-wrap">
                                                <input type="date" className="form-input" style={{ paddingLeft: 14 }}
                                                    value={form.start_date}
                                                    onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>End Date *</label>
                                            <div className="form-input-wrap">
                                                <input type="date" className="form-input" style={{ paddingLeft: 14 }}
                                                    value={form.end_date}
                                                    onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <div className="form-input-wrap">
                                            <select className="form-input" style={{ paddingLeft: 14 }}
                                                value={form.status}
                                                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                                <option value="Not Started">Not Started</option>
                                                <option value="Ongoing">Ongoing</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary btn-md" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-md" disabled={submitting}>
                                    {submitting ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : editing ? 'Update Internship' : 'Create Internship'}
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
                            <h4>Delete Internship?</h4>
                            <p>Are you sure you want to remove the internship for <strong>{deleteTarget.firstname} {deleteTarget.lastname}</strong> at <strong>{deleteTarget.company_name}</strong>?</p>
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
                                <div className="modal-icon"><GraduationCap size={18} color="white" /></div>
                                Internship Details
                            </h3>
                            <button className="modal-close" onClick={() => setShowView(false)}><X size={16} /></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10 }}>
                                    <StatusBadge status={viewTarget.status} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                                    <div style={{ background: 'var(--gray-50)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-100)' }}>
                                        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <User size={14} /> Student Assignment
                                        </h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div className="student-avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
                                                {(viewTarget.firstname?.[0] || '?')}{(viewTarget.lastname?.[0] || '')}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>{viewTarget.firstname} {viewTarget.lastname}</div>
                                                <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Student ID: #{viewTarget.student_id}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ background: 'var(--gray-50)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-100)' }}>
                                        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Building2 size={14} /> Host Organization
                                        </h4>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--blue-700)' }}>{viewTarget.company_name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>Partner Company ID: #{viewTarget.company_id}</div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div className="info-item" style={{ background: 'var(--blue-50)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--blue-600)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                                                <Calendar size={12} /> Start Date
                                            </label>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--blue-900)' }}>{fmtDate(viewTarget.start_date)}</div>
                                        </div>
                                        <div className="info-item" style={{ background: 'rgba(16, 185, 129, 0.05)', padding: 12, borderRadius: 'var(--radius-sm)' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#059669', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                                                <Clock size={12} /> End Date
                                            </label>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#065f46' }}>{fmtDate(viewTarget.end_date)}</div>
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

export default InternshipsPage;
