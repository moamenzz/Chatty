import { Loader } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";
const ProtectedRoutes = ({ allowedRoles }) => {
  const { User, accessToken, roles, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  return User?.roles?.find((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : User?.accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
