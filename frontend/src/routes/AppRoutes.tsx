import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import { PublicRoute } from "./guards/PublicRoute";
import LoginPage from "@/pages/auth/Login/LoginPage";
import AuthLayout from "@/components/layouts/AuthLayout";
import PublicLayout from "@/components/layouts/PublicLayout";
import Homepage from "@/pages/public/Home/Homepage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage/>} />
        </Route>

        <Route element={<PublicLayout/>}>
          <Route path="/" element={<Homepage/>}/>
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<>asdasd</>} />
      </Route>
    </Routes>
  );
};
