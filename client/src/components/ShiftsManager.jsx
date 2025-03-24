import React, { useState, useEffect } from 'react';
import './ShiftsManager.scss';
import ShiftMonthView from './ShiftMonthView';
import ShiftYearView from './ShiftYearView';
import ShiftEditor from './ShiftEditor';

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
    const [viewMode, setViewMode] = useState('week'); // 'week', 'month', or 'year'
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [shiftsToEdit, setShiftsToEdit] = useState(null);

    // First, let's add these timezone utility functions at the top of the component
    const timezoneUtils = {
        // Convert UTC date to Halifax time for display
        toHalifaxTime: (date) => {
            return new Date(date).toLocaleString('en-CA', {
                timeZone: 'America/Halifax',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        },

        // Format date for datetime-local input (Halifax time)
        formatForInput: (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleString('en-CA', {
                timeZone: 'America/Halifax',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).replace(', ', 'T');
        },

        // Convert local input time to UTC for server
        formatToUTC: (dateString) => {
            // Create a date object treating the input as Halifax time
            const [datePart, timePart] = dateString.split('T');
            const [year, month, day] = datePart.split('-');
            const [hours, minutes] = timePart.split(':');
            
            // Create date in UTC, treating the input time as Halifax time
            return new Date(Date.UTC(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes)
            )).toISOString();
        }
    };

    // Get start of week date
    function getStartOfWeek(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0); // Set to start of day
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
            let startDate, endDate;

            switch(viewMode) {
                case 'month':
                    startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
                    endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
                    break;
                case 'year':
                    startDate = new Date(selectedYear, 0, 1);
                    endDate = new Date(selectedYear, 11, 31);
                    break;
                default: // week view
                    startDate = selectedWeek;
                    endDate = new Date(selectedWeek);
                    endDate.setDate(endDate.getDate() + 6);
            }

            let url = `http://localhost:8080/api/shifts?start=${startDate.toISOString()}&end=${endDate.toISOString()}`;
            if (selectedEmployee !== 'all') {
                url += `&employee_id=${selectedEmployee}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
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
                body: JSON.stringify({
                    punch_in: timezoneUtils.formatToUTC(updates.punch_in),
                    punch_out: timezoneUtils.formatToUTC(updates.punch_out)
                }),
            });
            
            if (response.ok) {
                fetchShifts();
                setEditingShift(null);
                setShiftsToEdit(null);
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
            const shiftData = {
                employee_id: parseInt(newShift.employee_id),
                punch_in: timezoneUtils.formatToUTC(newShift.punch_in),
                punch_out: timezoneUtils.formatToUTC(newShift.punch_out)
            };

            const response = await fetch('http://localhost:8080/api/shifts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shiftData),
            });
            
            if (response.ok) {
                const data = await response.json();
                const shiftDate = new Date(data.punch_in);
                const newWeekStart = getStartOfWeek(shiftDate);
                setSelectedWeek(newWeekStart);
                setShowAddForm(false);
                setNewShift({ employee_id: '', punch_in: '', punch_out: '' });
                fetchShifts();
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

    const handleEditShifts = (shifts) => {
        setShiftsToEdit(shifts);
    };

    const handleCloseEditor = () => {
        setShiftsToEdit(null);
        fetchShifts();
    };

    const handleEditFromModal = (shift) => {
        setEditingShift(shift);
        setShiftsToEdit(null); // Close the editor modal
        setViewMode('week'); // Switch to week view
        const shiftDate = new Date(shift.punch_in);
        setSelectedWeek(getStartOfWeek(shiftDate)); // Set the week to show the shift being edited
    };

    const formatToLocalDateTime = (date) => {
        const halifaxDate = timezoneUtils.toHalifaxTime(date);
        // Convert "DD/MM/YYYY, HH:mm" to "YYYY-MM-DDTHH:mm"
        const [datePart, timePart] = halifaxDate.split(', ');
        const [month, day, year] = datePart.split('/');
        return `${year}-${month}-${day}T${timePart}`;
    };

    return (
        <div className="shifts-manager">
            <div className="controls">
                <div className="view-selector">
                    <select 
                        value={viewMode} 
                        onChange={(e) => setViewMode(e.target.value)}
                    >
                        <option value="week">Week View</option>
                        <option value="month">Month View</option>
                        <option value="year">Year View</option>
                    </select>
                </div>

                {viewMode === 'week' && (
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
                )}

                {viewMode === 'month' && (
                    <div className="month-selector">
                        <input
                            type="month"
                            value={`${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`}
                            onChange={(e) => setSelectedMonth(new Date(e.target.value))}
                        />
                    </div>
                )}

                {viewMode === 'year' && (
                    <div className="year-selector">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 10 }, (_, i) => 
                                new Date().getFullYear() - 5 + i
                            ).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                )}

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

            {viewMode === 'week' && (
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
                                                    defaultValue={timezoneUtils.formatForInput(shift.punch_in)}
                                                    onChange={(e) => {
                                                        setEditingShift({
                                                            ...editingShift,
                                                            punch_in: e.target.value
                                                        });
                                                    }}
                                                />
                                                <input
                                                    type="datetime-local"
                                                    defaultValue={timezoneUtils.formatForInput(shift.punch_out)}
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
                                                <p>In: {new Date(shift.punch_in).toLocaleTimeString('en-GB', { timeZone: 'America/Halifax' })}</p>
                                                <p>Out: {new Date(shift.punch_out).toLocaleTimeString('en-GB', { timeZone: 'America/Halifax' })}</p>
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
            )}

            {viewMode === 'month' && (
                <ShiftMonthView 
                    shifts={shifts}
                    month={selectedMonth.getMonth()}
                    year={selectedMonth.getFullYear()}
                    onEditShift={handleEditShifts}
                />
            )}

            {viewMode === 'year' && (
                <ShiftYearView 
                    shifts={shifts}
                    year={selectedYear}
                    onEditShift={handleEditShifts}
                />
            )}

            {shiftsToEdit && (
                <ShiftEditor 
                    shifts={shiftsToEdit}
                    onClose={handleCloseEditor}
                    onUpdate={handleEditFromModal}
                    onDelete={handleShiftDelete}
                />
            )}
        </div>
    );
}

export default ShiftsManager; 