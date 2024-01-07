import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import your useAuth hook

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    // console.log(currentUser)
    const location = useLocation();
    // console.log(location)

    if (!currentUser) {
        // Redirect to the login page if not authenticated
        // Pass the current location in state so we can redirect back after logging in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
