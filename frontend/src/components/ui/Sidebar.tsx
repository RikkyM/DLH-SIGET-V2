import { NavLink } from "react-router-dom";
import AccordionItem from "./AccordionItem";

const Sidebar = () => {
  return (
    <aside className="top-0 left-0 z-20 h-dvh w-72 min-w-72 overflow-auto border-r border-gray-200 shadow transition-colors">
      <header className="mx-3 grid h-20 place-items-center border-b text-center text-xl font-semibold whitespace-nowrap transition-all duration-250">
        <NavLink
          to="/"
          className="rounded-lg px-3 py-1.5 transition-all duration-300 hover:bg-gray-300"
        >
          DLH SIKPK V2
        </NavLink>
      </header>
      <nav className="no-scrollbar flex-1 space-y-2 overflow-x-hidden overflow-y-auto p-3 text-sm lg:text-base">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            [
              "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
              isActive
                ? "bg-[#27AEB9] text-white shadow"
                : "text-black hover:bg-gray-500/20",
            ].join(" ")
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/petugas"
          className={({ isActive }) =>
            [
              "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
              isActive
                ? "bg-[#27AEB9] text-white shadow"
                : "text-black hover:bg-gray-500/20",
            ].join(" ")
          }
        >
          Petugas
        </NavLink>
        <NavLink
          to="/penampungan-sementara"
          className={({ isActive }) =>
            [
              "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
              isActive
                ? "bg-[#27AEB9] text-white shadow"
                : "text-black hover:bg-gray-500/20",
            ].join(" ")
          }
        >
          Penampungan Sementara
        </NavLink>
        <NavLink
          to="/data-kendaraan"
          className={({ isActive }) =>
            [
              "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
              isActive
                ? "bg-[#27AEB9] text-white shadow"
                : "text-black hover:bg-gray-500/20",
            ].join(" ")
          }
        >
          Data Kendaraan
        </NavLink>
        {/* <NavLink
          to="/data-penugasan"
          className={({ isActive }) =>
            [
              "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
              isActive
                ? "bg-[#27AEB9] text-white shadow"
                : "text-black hover:bg-gray-500/20",
            ].join(" ")
          }
        >
          Penugasan
        </NavLink> */}
        {/* <NavLink
          to="/jenis-titik-sampah"
          className={({ isActive }) =>
            [
              "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
              isActive
                ? "bg-[#27AEB9] text-white shadow"
                : "text-black hover:bg-gray-500/20",
            ].join(" ")
          }
        >
          Jenis Titik Sampah
        </NavLink> */}
        <AccordionItem
          title="Master Data"
          routes={["/master-data/penampungan-sementara"]}
        >
          <NavLink
            to="/master-data/penugasan"
            className={({ isActive }) =>
              [
                "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
                isActive
                  ? "bg-[#27AEB9] text-white shadow"
                  : "text-black hover:bg-gray-500/20",
              ].join(" ")
            }
          >
            Penugasan
          </NavLink>
          <NavLink
            to="/master-data/penugasan"
            className={({ isActive }) =>
              [
                "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
                isActive
                  ? "bg-[#27AEB9] text-white shadow"
                  : "text-black hover:bg-gray-500/20",
              ].join(" ")
            }
          >
            Department
          </NavLink>
          <NavLink
            to="/master-data/kelurahan"
            className={({ isActive }) =>
              [
                "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
                isActive
                  ? "bg-[#27AEB9] text-white shadow"
                  : "text-black hover:bg-gray-500/20",
              ].join(" ")
            }
          >
            Kelurahan
          </NavLink>
          <NavLink
            to="/master-data/kecamatan"
            className={({ isActive }) =>
              [
                "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
                isActive
                  ? "bg-[#27AEB9] text-white shadow"
                  : "text-black hover:bg-gray-500/20",
              ].join(" ")
            }
          >
            Kecamatan
          </NavLink>
          <NavLink
            to="/master-data/jenis-kendaraan"
            className={({ isActive }) =>
              [
                "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
                isActive
                  ? "bg-[#27AEB9] text-white shadow"
                  : "text-black hover:bg-gray-500/20",
              ].join(" ")
            }
          >
            Jenis Kendaraan
          </NavLink>
          <NavLink
            to="/master-data/jenis-titik-sampah"
            className={({ isActive }) =>
              [
                "block flex items-center gap-2 rounded p-2 font-medium whitespace-nowrap transition-all duration-300 outline-none",
                isActive
                  ? "bg-[#27AEB9] text-white shadow"
                  : "text-black hover:bg-gray-500/20",
              ].join(" ")
            }
          >
            Jenis Titik Sampah
          </NavLink>
        </AccordionItem>
      </nav>
    </aside>
  );
};

export default Sidebar;
