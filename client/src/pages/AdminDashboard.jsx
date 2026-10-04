import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (err) {
            console.error('Ошибка при выходе из API', err);
        } finally {
            localStorage.removeItem('admin_token');
            navigate('/admin/login');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '200px 0' }}>
            <h1>Панель администратора</h1>
            <p>Здесь находится управление данными сайта.</p>
            <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>Выйти</button>
        </div>
    );
}