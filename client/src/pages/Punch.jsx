import React, { useState } from 'react';
import axios from 'axios';
import './punch.scss';

function Punch() {
    const [code, setCode] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handlePunch = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8080/api/punch', { code });
            
            if (!response.data.success) {
                setModalMessage('Invalid code');
            } else {
                setModalMessage(response.data.isPunchIn ? 'Punch in accepted' : 'Punch out successful');
            }
            
            setShowModal(true);
            setCode('');
            
        } catch (error) {
            console.error('Punch error:', error);
            setModalMessage('Error processing punch');
            setShowModal(true);
        }
    };

    const Modal = ({ message, onClose }) => (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{message}</h3>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );

    return (
        <div className="punch-container">
            <h1>Employee Punch System</h1>
            <form onSubmit={handlePunch}>
                <div className="input-group">
                    <label htmlFor="code">Enter your 4-digit code:</label>
                    <input
                        id="code"
                        type="text"
                        maxLength="4"
                        pattern="[0-9]{4}"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Punch</button>
            </form>

            {showModal && (
                <Modal 
                    message={modalMessage} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </div>
    );
}

export default Punch; 