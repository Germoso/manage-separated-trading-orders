// src/components/PrivateRoute.jsx
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute = ({ children } : PrivateRouteProps) => {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
