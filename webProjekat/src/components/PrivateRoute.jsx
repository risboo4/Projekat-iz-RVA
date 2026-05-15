import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth.js';

const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/cms/login" />;
};

export default PrivateRoute;
