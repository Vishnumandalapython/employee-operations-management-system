import Login from "./components/Login";
import Register from "./components/Register";
import SidebarLayout from "./components/SidebarLayout";
import EmployeeLayout from "./components/EmployeeLayout";
import Users from "./pages/Users";
import Posts from "./pages/Posts";
import UserDashboard from "./pages/UserDashboard";
import SuperadminDashboard from "./pages/SuperadminDashboard";
import Attendance from "./pages/Attendance";
import MyAttendance from "./pages/MyAttendance";
import {
    BrowserRouter,
    Route,
    Routes,Navigate
} from "react-router-dom";
import Leave from "./pages/Leave";
import MyLeave from "./pages/MyLeave";
import ProtectedRoute from "./routes/ProtectedRoute";
import Reports from "./pages/Reports";
import EmployeeAnnouncements from "./pages/EmployeeAnnouncements";
function App() {
    return (
       <BrowserRouter>
    <Routes>

        <Route
            path="/"
            element={<Navigate to="/login" replace />}
        />

        <Route
            path="/login"
            element={<Login />}
        />

        <Route
            path="/register"
            element={<Register />}
        />


        {/* SUPER ADMIN */}

        <Route
            element={
                <ProtectedRoute allowedRole="superadmin">
                    <SidebarLayout />
                </ProtectedRoute>
            }
        >
            <Route
                path="/superadmin/dashboard"
                element={<SuperadminDashboard />}
            />

            <Route
                path="/Users"
                element={<Users />}
            />

            <Route
                path="/attendance"
                element={<Attendance />}
            />

            <Route
                path="/leave"
                element={<Leave />}
            />

            <Route
                path="/posts"
                element={<Posts />}
            />

            <Route
                path="/reports"
                element={<Reports />}
            />
        </Route>


        {/* EMPLOYEE */}

     {/* EMPLOYEE */}

<Route
    element={
        <ProtectedRoute allowedRole="user">
            <EmployeeLayout />
        </ProtectedRoute>
    }
>
    <Route
        path="/user/dashboard"
        element={<UserDashboard />}
    />

    <Route
        path="/user/attendance"
        element={<MyAttendance />}
    />
    <Route
        path="/user/leave"
        element={<MyLeave />}
    />
   

    <Route
    path="/user/announcements"
    element={<EmployeeAnnouncements />}
/>
</Route>

    </Routes>
</BrowserRouter>
    );
}

export default App;