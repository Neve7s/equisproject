import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { useSeo } from "../lib/useSeo";

export function Layout() {
  useSeo();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
