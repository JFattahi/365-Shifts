import React from 'react';
import './ShiftYearView.scss';

function ShiftYearView({ shifts, year, onEditShift, onDeleteShift }) {
    // Group shifts by month
    const monthlyShifts = Array(12).fill(0).map(() => ({
        totalHours: 0,
        shiftCount: 0,
        shifts: [] // Store shifts for each month
    }));

    shifts.forEach(shift => {
        const month = new Date(shift.punch_in).getMonth();
        const duration = (new Date(shift.punch_out) - new Date(shift.punch_in)) / (1000 * 60 * 60);
        monthlyShifts[month].totalHours += duration;
        monthlyShifts[month].shiftCount++;
        monthlyShifts[month].shifts.push(shift);
    });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="shift-year-view">
            <table>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Total Shifts</th>
                        <th>Total Hours</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {monthlyShifts.map((data, index) => (
                        <tr key={months[index]}>
                            <td>{months[index]}</td>
                            <td>{data.shiftCount}</td>
                            <td>{data.totalHours.toFixed(2)}</td>
                            <td>
                                {data.shiftCount > 0 && (
                                    <button 
                                        onClick={() => onEditShift(data.shifts)}
                                        className="view-shifts-btn"
                                    >
                                        View/Edit Shifts
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ShiftYearView; 