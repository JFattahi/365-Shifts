import React from 'react';
import './ShiftMonthView.scss';

function ShiftMonthView({ shifts, month, year, onEditShift, onDeleteShift }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB');
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = (punch_in, punch_out) => {
        const start = new Date(punch_in);
        const end = new Date(punch_out);
        const diff = (end - start) / (1000 * 60 * 60); // Convert to hours
        return diff.toFixed(2);
    };

    return (
        <div className="shift-month-view">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Employee</th>
                        <th>Punch In</th>
                        <th>Punch Out</th>
                        <th>Duration (hrs)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shifts.map(shift => (
                        <tr key={shift.id}>
                            <td>{formatDate(shift.punch_in)}</td>
                            <td>{shift.employee_name}</td>
                            <td>{formatTime(shift.punch_in)}</td>
                            <td>{formatTime(shift.punch_out)}</td>
                            <td>{calculateDuration(shift.punch_in, shift.punch_out)}</td>
                            <td>
                                <button onClick={() => onEditShift([shift])}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ShiftMonthView; 