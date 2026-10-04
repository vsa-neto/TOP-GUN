import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:8000/api', // Или ваш URL Laravel API
    baseURL: 'http://127.0.0.1:8000/api', // Стандартный URL Laravel API
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Автоматически добавляем Bearer Token к каждому запросу, если он есть
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token_topgun');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => { return Promise.reject(error); }
);

// Опционально: если сервер вернет 401 (Unauthorized), разлогиниваем пользователя
api.interceptors.response.use(
    (response) => response,  // если есть response, тогда просто возвращаем его
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('admin_token_topgun');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default api;