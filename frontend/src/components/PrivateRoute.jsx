import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Note: Require authorizaton to access protected routes
// Redirect if unauthorized

const PrivateRoute = () => {
  const location = useLocation();

  console.log(`Private Route: ${location.pathname}`);

  // Get the current user state
  const { user } = useSelector((state) => state.auth);

  // If user does not exist, redirect
  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
