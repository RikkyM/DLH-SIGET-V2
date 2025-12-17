import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return null;

  return user ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : (
    <Navigate to="/login" replace state={{ from: loc }} />
  );
};

export default ProtectedRoute;
