import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    const menuItems = [
        {
            label: "Dashboard",
            path: "/superadmin/dashboard",
            icon: "⌂"
        },
        {
            label: "Employee Management",
            path: "/Users",
            icon: "♙"
        },
        {
            label: "Attendance",
            path: "/attendance",
            icon: "◷"
        },
        {
            label: "Leave Management",
            path: "/leave",
            icon: "▣"
        },
        {
            label: "Announcements",
            path: "/posts",
            icon: "◈"
        },
        {
            label: "Reports",
            path: "/reports",
            icon: "▥"
        }
    ];

    return (
        <aside className="eo-sidebar">

            {/* Brand */}
            <div className="eo-sidebar-brand">

                <div className="eo-sidebar-logo">
                    EO
                </div>

                <div>
                    <h2>Employee</h2>
                    <span>Operations</span>
                </div>

            </div>


            {/* Navigation */}
            <nav className="eo-sidebar-nav">

                <p className="eo-nav-title">
                    MAIN MENU
                </p>

                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? "eo-nav-link active"
                                : "eo-nav-link"
                        }
                    >

                        <span className="eo-nav-icon">
                            {item.icon}
                        </span>

                        <span className="eo-nav-label">
                            {item.label}
                        </span>

                    </NavLink>
                ))}

            </nav>


            {/* Bottom */}
            <div className="eo-sidebar-footer">

                <div className="eo-profile">

                    <div className="eo-profile-avatar">
                        A
                    </div>

                    <div className="eo-profile-details">
                        <strong>Administrator</strong>
                        <span>Super Admin</span>
                    </div>

                </div>


                <button
                    className="eo-signout"
                    onClick={handleLogout}
                >
                    <span>↪</span>
                    Sign out
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;