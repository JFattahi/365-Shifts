import React, { useState, useEffect } from 'react';
import './ShiftsManager.scss';

function ShiftsManager() {
    const [shifts, setShifts] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(getStartOfWeek(new Date()));
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('all');
    const [editingShift, setEditingShift] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newShift, setNewShift] = useState({
        employee_id: '',
        punch_in: '',
        punch_out: ''
    });

    // Get start of week date
    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-GB'); // This will format as dd/mm/yyyy
    };

    useEffect(() => {
        fetchEmployees();
        fetchShifts();
    }, [selectedWeek, selectedEmployee]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/employees');
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchShifts = async () => {
        try {
            const endDate = new Date(selectedWeek);
            endDate.setDate(endDate.getDate() + 6);
            
            // Add console logs to debug date ranges
            console.log('Fetching shifts between:', {
                start: selectedWeek.toISOString(),
                end: endDate.toISOString()
            });
            
            let url = `http://localhost:8080/api/shifts?start=${selectedWeek.toISOString()}&end=${endDate.toISOString()}`;
            if (selectedEmployee !== 'all') {
                url += `&employee_id=${selectedEmployee}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            console.log('Fetched shifts:', data); // Log the fetched data
            setShifts(data);
        } catch (error) {
            console.error('Error fetching shifts:', error);
        }
    };

    const handleShiftUpdate = async (shiftId, updates) => {
        try {
            const response = await fetch(`http://localhost:8080/api/shifts/${shiftId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
            
            if (response.ok) {
                fetchShifts();
                setEditingShift(null);
            }
        } catch (error) {
            console.error('Error updating shift:', error);
        }
    };

    const handleShiftDelete = async (shiftId) => {
        if (window.confirm('Are you sure you want to delete this shift?')) {
            try {
                await fetch(`http://localhost:8080/api/shifts/${shiftId}`, {
                    method: 'DELETE',
                });
                fetchShifts();
            } catch (error) {
                console.error('Error deleting shift:', error);
            }
        }
    };

    const handleAddShift = async (e) => {
        e.preventDefault();
        try {
            // Log the initial form data
            console.log('Form data before processing:', newShift);

            // Create a properly formatted shift object
            const shiftData = {
                employee_id: parseInt(newShift.employee_id),
                punch_in: new Date(newShift.punch_in).toISOString(),
                punch_out: new Date(newShift.punch_out).toISOString()
            };

            // Log the processed data being sent to server
            console.log('Data being sent to server:', shiftData);

            const response = await fetch('http://localhost:8080/api/shifts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shiftData),
            });
            
            // Log the response status
            console.log('Server response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Server response data:', data);
                
                // Set selectedWeek to the week containing the new shift
                const shiftDate = new Date(data.punch_in);
                setSelectedWeek(getStartOfWeek(shiftDate));
                
                fetchShifts();
                setShowAddForm(false);
                setNewShift({ employee_id: '', punch_in: '', punch_out: '' });
            } else {
                const error = await response.json();
                console.error('Error response from server:', error);
            }
        } catch (error) {
            console.error('Error in handleAddShift:', error);
        }
    };

    const calculateDuration = (punch_in, punch_out) => {
        const start = new Date(punch_in);
        const end = new Date(punch_out);
        const diff = (end - start) / (1000 * 60 * 60); // Convert to hours
        return diff.toFixed(2); // Return hours with 2 decimal places
    };

    return (
        <div className="shifts-manager">
            <div className="controls">
                <div className="week-selector">
                    <button 
                        onClick={() => {
                            const newDate = new Date(selectedWeek);
                            newDate.setDate(newDate.getDate() - 7);
                            setSelectedWeek(newDate);
                        }}
                    >
                        Previous Week
                    </button>
                    <span>
                        Week of {formatDate(selectedWeek)}
                    </span>
                    <button 
                        onClick={() => {
                            const newDate = new Date(selectedWeek);
                            newDate.setDate(newDate.getDate() + 7);
                            setSelectedWeek(newDate);
                        }}
                    >
                        Next Week
                    </button>
                </div>
                
                <select 
                    value={selectedEmployee} 
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                    <option value="all">All Employees</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                            {emp.first_name} {emp.last_name}
                        </option>
                    ))}
                </select>

                <button 
                    className="add-shift-button"
                    onClick={() => setShowAddForm(true)}
                >
                    Add New Shift
                </button>
            </div>

            {showAddForm && (
                <div className="add-shift-form">
                    <h3>Add New Shift</h3>
                    <form onSubmit={handleAddShift}>
                        <div>
                            <label>Employee:</label>
                            <select
                                value={newShift.employee_id}
                                onChange={(e) => setNewShift({...newShift, employee_id: e.target.value})}
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.first_name} {emp.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Punch In:</label>
                            <input
                                type="datetime-local"
                                value={newShift.punch_in}
                                onChange={(e) => setNewShift({...newShift, punch_in: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label>Punch Out:</label>
                            <input
                                type="datetime-local"
                                value={newShift.punch_out}
                                onChange={(e) => setNewShift({...newShift, punch_out: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-buttons">
                            <button type="submit">Add Shift</button>
                            <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="shifts-grid">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="day-column">
                        <h3>{day}</h3>
                        {shifts
                            .filter(shift => new Date(shift.punch_in).getDay() === (index + 1) % 7)
                            .map(shift => (
                                <div key={shift.id} className="shift-card">
                                    {editingShift?.id === shift.id ? (
                                        <div className="shift-edit">
                                            <input
                                                type="datetime-local"
                                                defaultValue={shift.punch_in.slice(0, 16)}
                                                onChange={(e) => {
                                                    setEditingShift({
                                                        ...editingShift,
                                                        punch_in: e.target.value
                                                    });
                                                }}
                                            />
                                            <input
                                                type="datetime-local"
                                                defaultValue={shift.punch_out.slice(0, 16)}
                                                onChange={(e) => {
                                                    setEditingShift({
                                                        ...editingShift,
                                                        punch_out: e.target.value
                                                    });
                                                }}
                                            />
                                            <button onClick={() => handleShiftUpdate(shift.id, editingShift)}>
                                                Save
                                            </button>
                                            <button onClick={() => setEditingShift(null)}>
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <p>{shift.employee_name}</p>
                                            <p>In: {new Date(shift.punch_in).toLocaleTimeString('en-GB')}</p>
                                            <p>Out: {new Date(shift.punch_out).toLocaleTimeString('en-GB')}</p>
                                            <p>Duration: {calculateDuration(shift.punch_in, shift.punch_out)} hours</p>
                                            <div className="actions">
                                                <button onClick={() => setEditingShift(shift)}>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleShiftDelete(shift.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ShiftsManager; 