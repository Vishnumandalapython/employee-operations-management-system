import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Register.css";

function Register() {
    const [fullName, setFullName] = useState("");
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
const [email, setEmail] = useState("");
const [department, setDepartment] = useState("");
const [role, setRole] = useState("user");
    const navigate = useNavigate();

   const handleSubmit = async () => {
    setMessage("");

    // Validation
    if (!fullName.trim()) {
        setMessage("Please enter your full name");
        return;
    }

    if (!userid.trim()) {
        setMessage("Please enter User ID");
        return;
    }

    if (!email.trim()) {
        setMessage("Please enter email");
        return;
    }

    if (!department.trim()) {
        setMessage("Please enter department");
        return;
    }

    if (!password) {
        setMessage("Please enter password");
        return;
    }

    if (!confirmPassword) {
        setMessage("Please confirm your password");
        return;
    }

    if (password !== confirmPassword) {
        setMessage("Passwords do not match");
        return;
    }

    if (!role) {
        setMessage("Please select account role");
        return;
    }

    try {
        const response = await api.post("/register", {
            fullName,
            userid,
            password,
            email,
            department,
            role,
        });

        if (response.data.success) {
            setMessage(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 800);
        } else {
            setMessage(response.data.message);
        }
    } catch (error) {
        console.log("Register error:", error);

        setMessage(
            error.response?.data?.message ||
            "Server error. Please try again."
        );
    }
};
    return (
        <div className="register-page">

            {/* Left Branding Section */}
            <div className="register-brand">

                <div className="register-brand-content">

                    <div className="register-logo">
                        EO
                    </div>

                    <h1>Employee Operations</h1>

                    <p className="register-brand-description">
                        Manage employees, attendance, leave and
                        organizational operations from one centralized platform.
                    </p>

                    <div className="register-features">

                        <div className="register-feature">
                            <span>✓</span>
                            <p>Centralized Employee Management</p>
                        </div>

                        <div className="register-feature">
                            <span>✓</span>
                            <p>Attendance & Leave Management</p>
                        </div>

                        <div className="register-feature">
                            <span>✓</span>
                            <p>Secure Role-Based Access</p>
                        </div>

                    </div>

                </div>

            </div>


            {/* Right Register Section */}
            <div className="register-section">

                <div className="register-card">

                    <div className="register-header">

                        <span className="register-eyebrow">
                            EMPLOYEE OPERATIONS
                        </span>

                        <h2>Create Account</h2>

                        <p>
                            Register a new employee account to get started.
                        </p>

                    </div>


                    <div className="register-form">

                        {/* Full Name */}
                        <div className="register-field">

                            <label>Full Name</label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) =>
                                    setFullName(e.target.value)
                                }
                            />

                        </div>


                        {/* User ID */}
                        <div className="register-field">

                            <label>Employee ID</label>

                            <input
                                type="text"
                                placeholder="Enter employee ID"
                                value={userid}
                                onChange={(e) =>
                                    setUserid(e.target.value)
                                }
                            />

                        </div>


                        {/* Password */}
                        <div className="register-field">

                            <label>Password</label>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                        </div>


                        {/* Confirm Password */}
                        <div className="register-field">

                            <label>Confirm Password</label>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                        </div>

{/* Email */}
<div className="register-field">

    <label>Email</label>

    <input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) =>
            setEmail(e.target.value)
        }
    />

</div>
{/* Department */}
<div className="register-field">

    <label>Department</label>

    <input
        type="text"
        placeholder="Enter department"
        value={department}
        onChange={(e) =>
            setDepartment(e.target.value)
        }
    />

</div>
{/* Role */}
<div className="register-field">

    <label>Account Role</label>

    <select
        value={role}
        onChange={(e) =>
            setRole(e.target.value)
        }
    >
        <option value="user">
            User / Employee
        </option>

        <option value="superadmin">
            Superadmin
        </option>
    </select>

</div>
                        {/* Show Password */}
                        <label className="show-password">

                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() =>
                                    setShowPassword(!showPassword)
                                }
                            />

                            <span>Show password</span>

                        </label>


                        {/* Message */}
                        {message && (
                            <div className="register-message">
                                {message}
                            </div>
                        )}


                        {/* Register Button */}
                        <button
                            className="register-button"
                            onClick={handleSubmit}
                        >
                            Create Account
                        </button>

                    </div>


                    {/* Login Link */}
                    <div className="register-login">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign in
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;
