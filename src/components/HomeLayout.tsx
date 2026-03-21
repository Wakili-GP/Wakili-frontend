import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer.tsx";
import MainNavbar from "./MainNavbar";

const HomeLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <MainNavbar />
      <div className="container mx-auto px-4">{children ?? <Outlet />}</div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
