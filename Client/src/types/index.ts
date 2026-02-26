export interface Student {
    student_id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    level: string;
}

export interface Company {
    company_id: number;
    company_name: string;
    address: string;
    email?: string;
    supervisor_name: string;
    supervisor_phone: string;
}

export interface Internship {
    internship_id: number;
    student_id: number;
    company_id: number;
    start_date: string;
    end_date: string;
    status: 'Not Started' | 'Ongoing' | 'Completed';
    firstname?: string;
    lastname?: string;
    company_name?: string;
}

export interface User {
    email: string;
    name: string;
    role: string;
    avatar: string;
}

export interface Notification {
    id: number;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'warning' | 'success';
}
