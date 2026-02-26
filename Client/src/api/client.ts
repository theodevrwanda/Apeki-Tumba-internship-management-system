import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE as string || 'http://localhost:30000/api';

export const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Students
export const getStudents = () => api.get('/students');
export const getStudentById = (id: number) => api.get(`/students/${id}`);
export const createStudent = (data: object) => api.post('/students', data);
export const updateStudent = (id: number, data: object) => api.put(`/students/${id}`, data);
export const deleteStudent = (id: number) => api.delete(`/students/${id}`);

// Companies
export const getCompanies = () => api.get('/companies');
export const getCompanyById = (id: number) => api.get(`/companies/${id}`);
export const createCompany = (data: object) => api.post('/companies', data);
export const updateCompany = (id: number, data: object) => api.put(`/companies/${id}`, data);
export const deleteCompany = (id: number) => api.delete(`/companies/${id}`);

// Internships
export const getInternships = () => api.get('/internships');
export const getInternshipById = (id: number) => api.get(`/internships/${id}`);
export const createInternship = (data: object) => api.post('/internships', data);
export const updateInternship = (id: number, data: object) => api.put(`/internships/${id}`, data);
export const deleteInternship = (id: number) => api.delete(`/internships/${id}`);
