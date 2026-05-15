import axios from 'axios';

const _axios = axios.create({
    // Ako Tomcat radi na drugom portu ili ima kontekst, promeni ovde
    baseURL: 'http://localhost:8080',
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
});

// Dodaje JWT token i session_id u svaki zahtev
_axios.interceptors.request.use((request) => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        request.headers.Authorization = `Bearer ${jwt}`;
    }

    const sessionId = localStorage.getItem('session_id');
    if (sessionId) {
        request.headers['X-Session-Id'] = sessionId;
    }

    return request;
});

// Ako server vrati 401, obrisi JWT i preusmeriti na login
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
