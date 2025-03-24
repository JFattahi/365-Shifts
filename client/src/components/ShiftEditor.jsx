import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import './ShiftEditor.scss';

function ShiftEditor({ shifts, onClose, onUpdate, onDelete }) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [shiftToDelete, setShiftToDelete] = useState(null);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB');
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDeleteClick = (shift) => {
        setShiftToDelete(shift);
        setShowConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        await onDelete(shiftToDelete.id);
        setShowConfirmation(false);
        setShiftToDelete(null);
        onClose(); // Close the editor after deletion
    };

    return (
        <div className="shift-editor">
            <div className="editor-header">
                <h2>Edit Shifts</h2>
                <button onClick={onClose}>Close</button>
            </div>
            <div className="shifts-list">
                {shifts.map(shift => (
                    <div key={shift.id} className="shift-item">
                        <div className="shift-info">
                            <p><strong>Date:</strong> {formatDate(shift.punch_in)}</p>
                            <p><strong>Employee:</strong> {shift.employee_name}</p>
                            <p><strong>Time:</strong> {formatTime(shift.punch_in)} - {formatTime(shift.punch_out)}</p>
                        </div>
                        <div className="shift-actions">
                            <button onClick={() => onUpdate(shift)}>Edit</button>
                            <button onClick={() => handleDeleteClick(shift)} className="delete">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showConfirmation && (
                <ConfirmationModal
                    message="Are you sure you want to delete this shift?"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </div>
    );
}

export default ShiftEditor; 