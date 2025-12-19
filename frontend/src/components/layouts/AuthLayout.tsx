import { Outlet } from "react-router-dom";
import logo from "@/assets/img/dlh-logo.webp";

const AuthLayout = () => {
  return (
    <section className="flex h-dvh w-full">
      <Outlet />
      <div className="hidden flex-1 items-center justify-center bg-[#27AEB9] lg:flex">
        <div className="w-full max-w-xl space-y-4 lg:px-10 text-white">
          {/* <div className="flex size-44 items-center justify-center rounded-xl border-2 border-white bg-white/20 p-4 shadow-white mx-auto">
          </div>
           */}
          <img src={logo} alt="logo" className="mx-auto w-full max-w-44" />
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">SIGET V2</h2>
            <h3 className="font-medium">Sistem Informasi geografis</h3>
            <h3 className="font-medium">Petugas dan TPS</h3>
          </div>
          {/* <div className="grid grid-cols-3 place-items-center gap-5">
            <div className="w-full rounded border border-black/20 bg-white/50 p-3 text-center font-medium shadow-black">
              <p>250+</p>
              <p>TPS Terdaftar</p>
            </div>
            <div className="w-full rounded border border-black/20 bg-white/50 p-3 text-center font-medium shadow-black">
              <p>1500+</p>
              <p>Petugas Aktif</p>
            </div>
            <div className="w-full rounded border border-black/20 bg-white/50 p-3 text-center font-medium shadow-black">
              <p>24/7</p>
              <p>Monitoring</p>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
