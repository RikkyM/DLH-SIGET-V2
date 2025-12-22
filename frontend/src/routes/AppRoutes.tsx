import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./guards/ProtectedRoute";
import LoginPage from "@/pages/auth/Login/LoginPage";
import AuthLayout from "@/components/layouts/AuthLayout";
import PublicLayout from "@/components/layouts/PublicLayout";
import Homepage from "@/pages/public/Home/Homepage";
import GuestRoute from "./guards/GuestRoute";
import DashboardPages from "@/pages/app/Dashboard/DashboardPages";
import PetugasPages from "@/pages/app/Petugas/PetugasPages";
import PenampunganPages from "@/pages/app/Penampungan-Sementara/PenampunganPages";
import DataKendaraanPages from "@/pages/app/Data-Kendaraan/DataKendaraanPages";

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
        <Route path="/penampungan-sementara" element={<PenampunganPages />} />
        <Route path="/data-kendaraan" element={<DataKendaraanPages />} />

        <Route path="/master-data">
          <Route path="penugasan" element={<>penugasan</>}/>
          <Route path="unit-kerja" element={<>unit kerja</>}/>
          <Route path="kelurahan" element={<>kelurahan</>}/>
          <Route path="kecamatan" element={<>kecamatan</>}/>
          <Route path="jenis-kendaraan" element={<>jenis kendaraan</>}/>
          <Route path="jenis-titik-sampah" element={<>jenis titik sampah</>}/>
        </Route>
      </Route>
    </Routes>
  );
};
