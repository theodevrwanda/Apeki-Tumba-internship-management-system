import axios from 'axios';

/**
 * API Base URL from environment variables or default
 */
const API_BASE = import.meta.env.VITE_API_BASE as string || 'http://localhost:30000/api';

/**
 * Axios instance with default configuration
 */
export const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// --- Students API ---

/** Fetch all students */
export const getStudents = () => api.get('/students');

/** Fetch a single student by ID */
export const getStudentById = (id: number) => api.get(`/students/${id}`);

/** Create a new student record */
export const createStudent = (data: any) => api.post('/students', data);

/** Update an existing student record */
export const updateStudent = (id: number, data: any) => api.put(`/students/${id}`, data);

/** Delete a student record */
export const deleteStudent = (id: number) => api.delete(`/students/${id}`);

// --- Companies API ---

/** Fetch all partner companies */
export const getCompanies = () => api.get('/companies');

/** Fetch a single company by ID */
export const getCompanyById = (id: number) => api.get(`/companies/${id}`);

/** Add a new partner company */
export const createCompany = (data: any) => api.post('/companies', data);

/** Update company information */
export const updateCompany = (id: number, data: any) => api.put(`/companies/${id}`, data);

/** Remove a company from the system */
export const deleteCompany = (id: number) => api.delete(`/companies/${id}`);

// --- Internships API ---

/** Fetch all internship assignments with student/company names */
export const getInternships = () => api.get('/internships');

/** Fetch a single internship by ID */
export const getInternshipById = (id: number) => api.get(`/internships/${id}`);

/** Create a new internship assignment */
export const createInternship = (data: any) => api.post('/internships', data);

/** Update an internship assignment */
export const updateInternship = (id: number, data: any) => api.put(`/internships/${id}`, data);

/** Cancel/Delete an internship assignment */
export const deleteInternship = (id: number) => api.delete(`/internships/${id}`);
