import React, { useState, useEffect } from 'react';
import './EmployeeManager.scss';

function EmployeeManager() {
    const [employees, setEmployees] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        code: '',
        title: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/employees');
            const data = await response.json();
            setEmployees(data);
        } catch (err) {
            setError('Failed to fetch employees');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingEmployee 
                ? `http://localhost:8080/api/employees/${editingEmployee.id}`
                : 'http://localhost:8080/api/employees';
            
            const method = editingEmployee ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchEmployees();
                setFormData({ first_name: '', last_name: '', code: '', title: '' });
                setShowAddForm(false);
                setEditingEmployee(null);
            } else {
                setError('Failed to save employee');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await fetch(`http://localhost:8080/api/employees/${id}`, {
                    method: 'DELETE',
                });
                fetchEmployees();
            } catch (err) {
                setError('Failed to delete employee');
            }
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            first_name: employee.first_name,
            last_name: employee.last_name,
            code: employee.code,
            title: employee.title
        });
        setShowAddForm(true);
    };

    return (
        <div className="employee-manager">
            {error && <p className="error">{error}</p>}
            
            <button 
                className="add-button"
                onClick={() => {
                    setShowAddForm(!showAddForm);
                    setEditingEmployee(null);
                    setFormData({ first_name: '', last_name: '', code: '', title: '' });
                }}
            >
                {showAddForm ? 'Cancel' : 'Add New Employee'}
            </button>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="employee-form">
                    <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Punch Code (4 digits):</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            pattern="[0-9]{4}"
                            maxLength="4"
                            required
                        />
                    </div>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit">
                        {editingEmployee ? 'Update Employee' : 'Add Employee'}
                    </button>
                </form>
            )}

            <div className="employees-list">
                <h2>Current Employees</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.code}</td>
                                <td>{`${employee.first_name} ${employee.last_name}`}</td>
                                <td>{employee.title}</td>
                                <td>
                                    <button onClick={() => handleEdit(employee)}>Edit</button>
                                    <button onClick={() => handleDelete(employee.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeManager; 