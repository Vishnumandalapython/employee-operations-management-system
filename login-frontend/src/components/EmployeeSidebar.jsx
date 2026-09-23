import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./EmployeeSidebar.css";

function EmployeeSidebar() {

    const navigate = useNavigate();

    const user = useSelector(
        (state) => state.auth.user
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    const menuItems = [
        {
            label: "Dashboard",
            path: "/user/dashboard",
            icon: "⌂"
        },
        {
            label: "My Attendance",
            path: "/user/attendance",
            icon: "◷"
        },
        {
            label: "My Leave",
            path: "/user/leave",
            icon: "▣"
        },
        {
            label: "Announcements",
            path: "/user/announcements",
            icon: "◈"
        }
    ];

    return (
        <aside className="employee-sidebar">

            <div className="employee-sidebar-brand">

                <div className="employee-sidebar-logo">
                    EO
                </div>

                <div>
                    <h2>Employee</h2>
                    <span>Operations</span>
                </div>

            </div>


            <nav className="employee-sidebar-nav">

                <p className="employee-nav-title">
                    MAIN MENU
                </p>

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? "employee-nav-link active"
                                : "employee-nav-link"
                        }
                    >

                        <span className="employee-nav-icon">
                            {item.icon}
                        </span>

                        <span className="employee-nav-label">
                            {item.label}
                        </span>

                    </NavLink>

                ))}

            </nav>


            <div className="employee-sidebar-footer">

                <div className="employee-profile">

                    <div className="employee-profile-avatar">
                        {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="employee-profile-details">

                        <strong>
                            {user?.fullName || "Employee"}
                        </strong>

                        <span>
                            Employee
                        </span>

                    </div>

                </div>


                <button
                    className="employee-signout"
                    onClick={handleLogout}
                >
                    <span>↪</span>
                    Sign out
                </button>

            </div>

        </aside>
    );
}

export default EmployeeSidebar;