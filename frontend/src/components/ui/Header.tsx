import { PAGE_TITLE } from "@/constants/PageTitles";
import { useAuth } from "@/hooks/useAuth";
// import { RefreshCcw } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const pageTitle = PAGE_TITLE[pathname] ?? pathname.replace("/", "");

  return (
    <div className="sticky top-0 left-0 flex h-20 min-h-20 w-full items-center justify-between gap-2 bg-[#F5F5F5] px-5 shadow z-30">
      <div className="flex items-center justify-end gap-2">
        <h2 className="font-bold capitalize lg:text-xl">{pageTitle}</h2>
      </div>
      <div className="flex items-center gap-2">
        <p className="capitalize">{user?.username.toLowerCase()}</p>
        <button
          type="button"
          onClick={() => logout()}
          className="m-2 min-w-[8ch] cursor-pointer rounded bg-red-500 px-3 py-1.5 text-white shadow"
        >
          {/* {loading ? (
            <RefreshCcw className="mx-auto max-h-5 max-w-4 animate-spin" />
          ) : (
            "Logout"
          )} */}
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
