import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginUser } from "../redux/authSlice";

import "./Login.css";

function Login() {

    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loading = useSelector(
        (state) => state.auth.loading
    );

    const error = useSelector(
        (state) => state.auth.error
    );


    const handleLogin = async () => {

        if (!userid) {
            setMessage("Employee ID is required");
            return;
        }

        if (!password) {
            setMessage("Password is required");
            return;
        }

        try {

            const result = await dispatch(
                loginUser({
                    userid,
                    password
                })
            ).unwrap();

            setMessage("Login successful");

            if (result.user.role === "superadmin") {

                navigate("/superadmin/dashboard");

            } else if (result.user.role === "user") {

                navigate("/user/dashboard");

            } else {

                setMessage("Invalid user role");

            }

        } catch (error) {

            console.log("LOGIN ERROR:", error);

            setMessage(
                typeof error === "string"
                    ? error
                    : error?.message || "Login failed"
            );

        }

    };


    return (

        <div className="login-page">

            {/* LEFT BRANDING PANEL */}

            <div className="login-brand-panel">

                <div className="brand-content">

                    <div className="brand-logo">
                        EO
                    </div>

                    <h1>
                        Employee
                        <br />
                        Operations
                    </h1>

                    <p className="brand-description">
                        A centralized platform for managing
                        employees, attendance, leave and
                        everyday organizational operations.
                    </p>


                    <div className="brand-features">

                        <div className="brand-feature">
                            <span className="feature-icon">
                                ✓
                            </span>

                            <span>
                                Employee Management
                            </span>
                        </div>


                        <div className="brand-feature">
                            <span className="feature-icon">
                                ✓
                            </span>

                            <span>
                                Attendance Tracking
                            </span>
                        </div>


                        <div className="brand-feature">
                            <span className="feature-icon">
                                ✓
                            </span>

                            <span>
                                Leave Management
                            </span>
                        </div>

                    </div>

                </div>


                <div className="brand-decoration decoration-one"></div>
                <div className="brand-decoration decoration-two"></div>
                <div className="brand-decoration decoration-three"></div>

            </div>


            {/* RIGHT LOGIN PANEL */}

            <div className="login-form-panel">

                <div className="login-wrapper">

                    <div className="mobile-brand">
                        <div className="mobile-logo">
                            EO
                        </div>

                        <span>
                            Employee Operations
                        </span>
                    </div>


                    <div className="login-heading">

                        <span className="welcome-text">
                            Welcome back
                        </span>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Enter your employee credentials
                            to continue.
                        </p>

                    </div>


                    <div className="login-form">


                        {/* EMPLOYEE ID */}

                        <div className="input-group">

                            <label htmlFor="userid">
                                Employee ID
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ID
                                </span>

                                <input
                                    id="userid"
                                    type="text"
                                    placeholder="Enter your employee ID"
                                    value={userid}
                                    onChange={(e) =>
                                        setUserid(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="input-group">

                            <div className="password-label-row">

                                <label htmlFor="password">
                                    Password
                                </label>

                            </div>


                            <div className="input-wrapper">

                                <span className="input-icon password-icon">
                                    •••
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    className="show-password"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            className="login-btn"
                            onClick={handleLogin}
                            disabled={loading}
                        >

                            <span>
                                {loading
                                    ? "Signing in..."
                                    : "Sign in"}
                            </span>

                            {!loading && (
                                <span className="arrow">
                                    →
                                </span>
                            )}

                        </button>


                        {/* MESSAGE */}

                        {message && (

                            <div className="login-message">

                                <span className="message-dot"></span>

                                <span>
                                    {message}
                                </span>

                            </div>

                        )}


                        {error && !message && (

                            <div className="login-message error">

                                <span className="message-dot"></span>

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}

                    </div>


                    {/* REGISTER */}

                    <div className="register-section">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create an account
                        </Link>

                    </div>


                    <div className="login-footer">

                        <span>
                            Secure employee portal
                        </span>

                        <span className="footer-dot">
                            •
                        </span>

                        <span>
                            Employee Operations Management
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Login;