import axios from 'axios';

const _axios = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
});

_axios.interceptors.request.use((request) => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        request.headers.Authorization = `Bearer ${jwt}`;
    }
    return request;
});

_axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jwt');
            window.location.href = '/cms/login';
        }
        return Promise.reject(error);
    }
);

export default _axios;
