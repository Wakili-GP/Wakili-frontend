import { type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import DarkFooter from "./DarkFooter.tsx";
import MainNavbar from "./MainNavbar";
import AuthModals from "./AuthModals.tsx";

const HomeLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <MainNavbar />
      <div className="container mx-auto px-4">{children ?? <Outlet />}</div>
      <AuthModals />
      <DarkFooter />
    </div>
  );
};

export default HomeLayout;
