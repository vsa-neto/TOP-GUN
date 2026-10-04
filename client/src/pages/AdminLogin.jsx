import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.token) {
                // Сохраняем токен в браузер
                localStorage.setItem('admin_token', response.data.token);
                // Редирект на админ-панель
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка авторизации');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '200px 0' }}>
            <h2>Вход для администратора</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Пароль: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" style={{ marginTop: '15px' }}>Войти</button>
            </form>
        </div>
    );
}