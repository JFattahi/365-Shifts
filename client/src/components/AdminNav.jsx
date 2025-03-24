import React from 'react';
import './AdminNav.scss';

function AdminNav({ activeTab, setActiveTab }) {
    return (
        <nav className="admin-nav">
            <button 
                className={activeTab === 'employees' ? 'active' : ''} 
                onClick={() => setActiveTab('employees')}
            >
                Employees
            </button>
            <button 
                className={activeTab === 'shifts' ? 'active' : ''} 
                onClick={() => setActiveTab('shifts')}
            >
                Shifts
            </button>
        </nav>
    );
}

export default AdminNav; 