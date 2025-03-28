import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.scss';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username, 
                    password,
                    isAdmin: isAdminLogin 
                }),
            });

            const data = await response.json();
            if (data.success) {
                navigate(isAdminLogin ? '/admin' : '/punch');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="toggle-container">
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={isAdminLogin}
                            onChange={(e) => setIsAdminLogin(e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                    <span className="toggle-label">
                        {isAdminLogin ? 'Admin Page' : 'Clock In/Out'}
                    </span>
                </div>
                {error && <p className="error">{error}</p>}
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login; 