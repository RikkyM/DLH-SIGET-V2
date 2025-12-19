import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import LoginPage from "@/pages/auth/Login/LoginPage";
import AuthLayout from "@/components/layouts/AuthLayout";
import PublicLayout from "@/components/layouts/PublicLayout";
import Homepage from "@/pages/public/Home/Homepage";
import GuestRoute from "./guards/GuestRoute";
import DashboardPages from "@/pages/app/Dashboard/DashboardPages";
import PetugasPages from "@/pages/app/Petugas/PetugasPages";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Homepage />} />
      </Route>

      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPages />} />
        <Route path="/petugas" element={<PetugasPages />} />
      </Route>
    </Routes>
  );
};
