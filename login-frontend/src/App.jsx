import Login from "./components/Login";
import Register from "./components/Register";
import SidebarLayout from "./components/SidebarLayout";

import Users from "./pages/Users";
import Posts from "./pages/Posts";
import UserDashboard from "./pages/UserDashboard";
import SuperadminDashboard from "./pages/SuperadminDashboard";
import Attendance from "./pages/Attendance";
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";
import Leave from "./pages/Leave";
import ProtectedRoute from "./routes/ProtectedRoute";
import Reports from "./pages/Reports";
function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* PUBLIC ROUTES */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* SUPERADMIN ROUTES */}

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
    path="/leave"
    element={<Leave />}
/>
<Route
    path="/attendance"
    element={<Attendance />}
/>
<Route
    path="/reports"
    element={<Reports />}
/>
                    <Route
                        path="/posts"
                        element={<Posts />}
                    />

                </Route>

                {/* NORMAL USER ROUTE */}

                <Route
                    path="/user/dashboard"
                    element={
                        <ProtectedRoute allowedRole="user">
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;