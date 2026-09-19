import React from 'react';

const RoleSelector = ({ onSelect }) => {
    const roles = ['Patient', 'Doctor', 'Receptionist', 'Pharmacist', 'Admin'];

    return (
        <div className="flex justify-center space-x-4 my-6">
            {roles.map((role) => (
                <button
                    key={role}
                    onClick={() => onSelect(role)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {role}
                </button>
            ))}
        </div>
    );
};

export default RoleSelector;
