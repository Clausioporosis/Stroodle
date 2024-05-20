const UserInitials: React.FC<{ firstName: string, lastName: string }> = ({ firstName, lastName }) => {
    const initials = `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`;

    return (
        <div style={{
            height: '30px',
            width: '30px',
            backgroundColor: '#555',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            marginRight: '10px'
        }}>
            {initials.toUpperCase()}
        </div>
    );
};

export default UserInitials;