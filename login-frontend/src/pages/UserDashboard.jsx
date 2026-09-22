import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
function UserDashboard() {

    const user = useSelector(
        (state) => state.auth.user
    );

    return (
        <div>
 <Sidebar />
            <h1>User Dashboard</h1>

            <h2>Welcome, {user?.fullName}</h2>

            <p>
                User ID: {user?.userid}
            </p>

            <p>
                Role: {user?.role}
            </p>

            <h3>User Features</h3>

            <ul>
                <li>View Profile</li>
                <li>View Posts</li>
                <li>View Dashboard</li>
            </ul>

        </div>
    );
}

export default UserDashboard;