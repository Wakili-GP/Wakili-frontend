import { type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DarkFooter from "./DarkFooter.tsx";
import MainNavbar from "./MainNavbar";

const HomeLayout = ({ children }: { children?: ReactNode }) => {
  const { pathname } = useLocation();
  const isFullWidthPage =
    pathname === "/find-lawyers" ||
    pathname === "/find-lawyers/results" ||
    pathname === "/ai-contract-review" ||
    pathname === "/articles" ||
    pathname.startsWith("/articles/") ||
    pathname.startsWith("/forum");

  return (
    <div className="min-h-screen overflow-x-clip bg-linear-to-b from-background to-muted/30">
      <MainNavbar />
      <div className={isFullWidthPage ? "w-full" : "container mx-auto px-4"}>
        {children ?? <Outlet />}
      </div>
      <DarkFooter />
    </div>
  );
};

export default HomeLayout;
