import React, { useState } from 'react';
import AdminNav from '../components/AdminNav';
import ShiftsManager from '../components/ShiftsManager';
import EmployeeManager from '../components/EmployeeManager';
import './admin.scss';

function Admin() {
    const [activeTab, setActiveTab] = useState('employees');

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === 'employees' ? (
                <EmployeeManager />
            ) : (
                <ShiftsManager />
            )}
        </div>
    );
}

export default Admin; 