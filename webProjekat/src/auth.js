// Generise session_id za anonimne korisnike (posete, reakcije)
export const initSession = () => {
    if (!localStorage.getItem('session_id')) {
        localStorage.setItem('session_id', crypto.randomUUID());
    }
};

const getPayload = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return null;
    try {
        const parts = jwt.split('.');
        if (parts.length !== 3) return null;
        return JSON.parse(atob(parts[1]));
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    const payload = getPayload();
    return payload !== null;
};

export const getRole = () => {
    const payload = getPayload();
    return payload?.role ?? null;
};

export const getFullName = () => {
    const payload = getPayload();
    if (!payload) return '';
    return `${payload.firstName} ${payload.lastName}`;
};

export const logout = (navigate) => {
    localStorage.removeItem('jwt');
    navigate('/cms/login');
};
