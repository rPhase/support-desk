import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth);

  return user !== null ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
