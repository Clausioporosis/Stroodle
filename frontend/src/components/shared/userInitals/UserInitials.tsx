import React from 'react';

interface UserInitialsProps {
    firstName: string;
    lastName: string;
    size?: number;
    backgroundColor?: string;
    textColor?: string;
    border?: string;
}

const UserInitials: React.FC<UserInitialsProps> = ({ firstName, lastName, size = 30, backgroundColor = '#555', textColor = '#fff', border = '1.5px solid var(--text-color)' }) => {
    const initials = `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`;

    return (
        <div
            className="user-initials"
            style={{
                height: size,
                width: size,
                fontSize: size / 2,
                backgroundColor,
                border,
                color: textColor
            }}
        >
            {initials.toUpperCase()}
        </div>
    );
};

export default UserInitials;
