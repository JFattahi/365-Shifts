import React from 'react';
import './ConfirmationModal.scss';

function ConfirmationModal({ message, onConfirm, onCancel }) {
    return (
        <div className="confirmation-modal">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm">Confirm</button>
                    <button onClick={onCancel} className="cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal; 