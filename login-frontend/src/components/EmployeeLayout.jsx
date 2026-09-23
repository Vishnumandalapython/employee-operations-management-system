import { Outlet } from "react-router-dom";
import EmployeeSidebar from "./EmployeeSidebar";
import "./EmployeeLayout.css";

function EmployeeLayout() {

    return (
        <div className="employee-app-layout">

            <EmployeeSidebar />

            <main className="employee-main-content">
                <Outlet />
            </main>

        </div>
    );
}

export default EmployeeLayout;