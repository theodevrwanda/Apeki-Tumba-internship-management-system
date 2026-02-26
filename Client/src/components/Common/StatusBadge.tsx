import React from 'react';

interface StatusBadgeProps {
    status: string;
}

/**
 * Common Badge component for displaying internship status
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getBadgeClass = (status: string) => {
        switch (status) {
            case 'Ongoing':
                return 'badge badge-ongoing';
            case 'Completed':
                return 'badge badge-completed';
            case 'Not Started':
            default:
                return 'badge badge-notstarted';
        }
    };

    return (
        <span className={getBadgeClass(status)}>
            {status}
        </span>
    );
};

export default StatusBadge;
