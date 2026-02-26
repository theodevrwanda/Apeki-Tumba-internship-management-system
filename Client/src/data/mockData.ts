import type { User, Notification } from '../types';

export const MOCK_USER: User = {
    email: 'example@gmail.com',
    name: 'Admin User',
    role: 'Administrator',
    avatar: '/admin-avatar.png',
};

export const MOCK_CREDENTIALS = {
    email: 'example@gmail.com',
    password: '1234567',
};

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        message: 'New student John Doe registered for internship',
        time: '2 minutes ago',
        read: false,
        type: 'info',
    },
    {
        id: 2,
        message: 'TechCorp Ltd. internship status updated to Completed',
        time: '1 hour ago',
        read: false,
        type: 'success',
    },
    {
        id: 3,
        message: '3 internships ending this week',
        time: '3 hours ago',
        read: false,
        type: 'warning',
    },
    {
        id: 4,
        message: 'New company GlobalTech added to system',
        time: '1 day ago',
        read: true,
        type: 'info',
    },
    {
        id: 5,
        message: 'System backup completed successfully',
        time: '2 days ago',
        read: true,
        type: 'success',
    },
];
