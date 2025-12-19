import { NavLink } from "react-router-dom";
import logo from "@/assets/img/dlh-logo.webp";
import { useAuth } from "@/hooks/useAuth";

const PublicNavbar = () => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 left-0 z-20 flex h-20 justify-between bg-[#ECF6EE] px-5">
      <div className="flex items-center gap-3">
        <img src={logo} alt="logo" className="w-full max-w-24" />
        <div>
          <h4 className="text-xl font-medium">SIGET V2</h4>
          <h5 className="font-medium text-gray-500">
            Sistem Informasi Geografis Petugas dan TPS
          </h5>
        </div>
      </div>
      <nav className="flex items-center capitalize">
        {user ? (
          <div className="flex items-center gap-3">
            <p>{user?.username.toLowerCase()}</p>
            <NavLink
              to="/dashboard"
              className="rounded bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-teal-600"
            >
              Dashboard
            </NavLink>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-600"
          >
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default PublicNavbar;
