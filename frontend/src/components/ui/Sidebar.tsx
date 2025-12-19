import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="top-0 left-0 z-20 h-dvh w-72 min-w-72 overflow-auto border-r border-gray-200 shadow transition-colors">
      <header className="mx-3 grid h-20 place-items-center border-b text-center text-xl font-semibold whitespace-nowrap transition-all duration-250">
        DLH SIKPK V2
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
      </nav>
    </aside>
  );
};

export default Sidebar;
