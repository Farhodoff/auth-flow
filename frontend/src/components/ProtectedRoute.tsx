import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    roles?: string[];
}

const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        // You can replace this with a proper loading spinner
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
