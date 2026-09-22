import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./SidebarLayout.css";

function SidebarLayout() {
    return (
        <div className="eo-app-layout">

            <Sidebar />

            <main className="eo-main-content">
                <Outlet />
            </main>

        </div>
    );
}

export default SidebarLayout;