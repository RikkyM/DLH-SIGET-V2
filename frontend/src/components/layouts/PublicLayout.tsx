import { Outlet } from "react-router-dom";
import PublicNavbar from "../navbar/PublicNavbar";

const PublicLayout = () => {
  return (
    <section>
      <PublicNavbar />
      <Outlet />
    </section>
  );
};

export default PublicLayout;
