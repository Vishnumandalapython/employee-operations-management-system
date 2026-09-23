import { useEffect, useState } from "react";
import api from "../api/api";
import "./MyAttendance.css";

function MyAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyAttendance();
    }, []);

    const fetchMyAttendance = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/attendance/me");

            console.log("MY ATTENDANCE RESPONSE:", response.data);

            setAttendance(response.data.attendance || []);
        } catch (error) {
            console.error("MY ATTENDANCE ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load attendance records"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-attendance-page">

            {/* HEADER */}
            <div className="my-attendance-header">
                <div>
                    <p className="my-attendance-eyebrow">
                        EMPLOYEE PORTAL
                    </p>

                    <h1>My Attendance</h1>

                    <p>
                        View your attendance records and daily attendance status.
                    </p>
                </div>

                <button
                    className="attendance-refresh-btn"
                    onClick={fetchMyAttendance}
                >
                    ↻ Refresh
                </button>
            </div>


            {/* CONTENT */}

            {loading && (
                <div className="attendance-message">
                    Loading attendance...
                </div>
            )}


            {!loading && error && (
                <div className="attendance-message attendance-error">
                    {error}
                </div>
            )}


            {!loading && !error && attendance.length === 0 && (
                <div className="attendance-message">
                    No attendance records found.
                </div>
            )}


            {!loading && !error && attendance.length > 0 && (

                <div className="attendance-table-container">

                    <table className="my-attendance-table">

                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {attendance.map((record) => (

                                <tr key={record.id}>

                                    <td>
                                        {record.attendance_date}
                                    </td>

                                    <td>
                                        {record.check_in || "-"}
                                    </td>

                                    <td>
                                        {record.check_out || "-"}
                                    </td>

                                    <td>
                                        <span
                                            className={`attendance-status ${record.status
                                                ?.toLowerCase()
                                                .replace(" ", "-")}`}
                                        >
                                            {record.status}
                                        </span>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default MyAttendance;