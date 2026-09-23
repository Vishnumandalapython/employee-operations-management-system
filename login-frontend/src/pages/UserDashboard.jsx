import { useSelector } from "react-redux";
import "./UserDashboard.css";

function UserDashboard() {

    const user = useSelector(
        (state) => state.auth.user
    );

    return (
        <div className="employee-dashboard">

            <div className="employee-dashboard-header">

                <div>
                    <p className="employee-dashboard-eyebrow">
                        EMPLOYEE PORTAL
                    </p>

                    <h1>
                        Welcome, {user?.fullName || "Employee"} 👋
                    </h1>

                    <p>
                        Manage your attendance, leave requests
                        and company announcements.
                    </p>
                </div>

            </div>


            <div className="employee-dashboard-cards">

                <div className="employee-dashboard-card">

                    <span className="dashboard-card-icon">
                        ◷
                    </span>

                    <div>
                        <span>Today's Attendance</span>
                        <strong>--</strong>
                    </div>

                </div>


                <div className="employee-dashboard-card">

                    <span className="dashboard-card-icon">
                        ✓
                    </span>

                    <div>
                        <span>Present Days</span>
                        <strong>--</strong>
                    </div>

                </div>


                <div className="employee-dashboard-card">

                    <span className="dashboard-card-icon">
                        ▣
                    </span>

                    <div>
                        <span>Leave Requests</span>
                        <strong>--</strong>
                    </div>

                </div>


                <div className="employee-dashboard-card">

                    <span className="dashboard-card-icon">
                        !
                    </span>

                    <div>
                        <span>Pending Leaves</span>
                        <strong>--</strong>
                    </div>

                </div>

            </div>


            <div className="employee-dashboard-grid">

                <section className="employee-dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>My Attendance</h2>
                            <p>
                                Your recent attendance records
                            </p>
                        </div>

                    </div>

                    <div className="dashboard-empty-state">
                        <span>◷</span>

                        <p>
                            Attendance information will appear here.
                        </p>
                    </div>

                </section>


                <section className="employee-dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>My Leave Requests</h2>
                            <p>
                                Track your leave applications
                            </p>
                        </div>

                    </div>

                    <div className="dashboard-empty-state">
                        <span>▣</span>

                        <p>
                            Your leave requests will appear here.
                        </p>
                    </div>

                </section>

            </div>


            <section className="employee-dashboard-panel announcements-panel">

                <div className="dashboard-panel-header">

                    <div>
                        <h2>Announcements</h2>

                        <p>
                            Latest company announcements
                        </p>
                    </div>

                </div>

                <div className="dashboard-empty-state">

                    <span>◈</span>

                    <p>
                        Latest announcements will appear here.
                    </p>

                </div>

            </section>


        </div>
    );
}

export default UserDashboard;