import { NavLink } from "react-router-dom";
import logo from "@/assets/img/dlh-logo.webp";

const PublicNavbar = () => {
  return (
    <header className="flex h-20 justify-between bg-[#ECF6EE] px-5 sticky top-0 left-0 z-20">
      <div className="flex items-center gap-3">
        <img src={logo} alt="logo" className="w-full max-w-24" />
        <div>
          <h4 className="text-xl font-medium">SIGET V2</h4>
          <h5 className="font-medium text-gray-500">
            Sistem Informasi Geografis
          </h5>
        </div>
      </div>
      <nav className="flex items-center">
        <NavLink
          to="/login"
          className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-600"
        >
          Login
        </NavLink>
      </nav>
    </header>
  );
};

export default PublicNavbar;
