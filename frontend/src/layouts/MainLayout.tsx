import type { ReactNode } from "react";
import Navbar from "../components/common/Navbar";

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen bg-[#F8FAFC] overflow-hidden">
      <Navbar />

      <main className="h-[calc(100vh-64px)] px-8 py-5">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;