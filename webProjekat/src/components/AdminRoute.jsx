import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../auth.js';

const AdminRoute = ({ element }) => {
    if (!isAuthenticated()) return <Navigate to="/cms/login" />;
    if (getRole() !== 'ADMIN') return <Navigate to="/cms/categories" />;
    return element;
};

export default AdminRoute;
