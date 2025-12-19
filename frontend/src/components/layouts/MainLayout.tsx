import { type ReactNode } from "react";
import Header from "../ui/Header";
import Sidebar from "../ui/Sidebar";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="flex h-dvh bg-linear-to-b from-[#F5F5F5] from-65% to-[#EFDBB0]">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-auto">
        <Header />
        {children}
      </main>
    </section>
  );
};

export default MainLayout;
