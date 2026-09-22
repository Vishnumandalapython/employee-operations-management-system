import { useEffect, useState } from "react";
import api from "../api/api";

function Attendance() {

    // =========================
    // STATE
    // =========================

    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        employee_id: "",
        attendance_date: "",
        check_in: "",
        check_out: "",
        status: "Present"
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    // =========================
    // FETCH DATA
    // =========================

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                attendanceResponse,
                usersResponse
            ] = await Promise.all([
                api.get("/attendance"),
                api.get("/users")
            ]);

            setAttendance(
                attendanceResponse.data.attendance || []
            );

            setEmployees(
                usersResponse.data || []
            );

        } catch (error) {

            console.log("Attendance fetch error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load attendance data"
            );

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    // =========================
    // SUBMIT FORM
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            if (editingId) {

                const response = await api.put(
                    `/attendance/${editingId}`,
                    formData
                );

                setMessage(
                    response.data.message
                );

            } else {

                const response = await api.post(
                    "/attendance",
                    formData
                );

                setMessage(
                    response.data.message
                );
            }

            // Reset form
            setFormData({
                employee_id: "",
                attendance_date: "",
                check_in: "",
                check_out: "",
                status: "Present"
            });

            setEditingId(null);

            // Get latest data
            await fetchData();

        } catch (error) {

            console.log("Attendance save error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to save attendance"
            );
        }
    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = (record) => {

        setEditingId(record.id);

        setFormData({
            employee_id: record.employee_id,
            attendance_date: record.attendance_date,
            check_in: record.check_in
                ? record.check_in.substring(0, 5)
                : "",
            check_out: record.check_out
                ? record.check_out.substring(0, 5)
                : "",
            status: record.status
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancelEdit = () => {

        setEditingId(null);

        setFormData({
            employee_id: "",
            attendance_date: "",
            check_in: "",
            check_out: "",
            status: "Present"
        });

        setMessage("");
        setError("");
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this attendance record?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setMessage("");
            setError("");

            const response = await api.delete(
                `/attendance/${id}`
            );

            setMessage(
                response.data.message
            );

            await fetchData();

        } catch (error) {

            console.log("Attendance delete error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete attendance"
            );
        }
    };

    // =========================
    // STATUS STYLE
    // =========================

    const getStatusStyle = (status) => {

        if (status === "Present") {
            return {
                backgroundColor: "#dcfce7",
                color: "#166534"
            };
        }

        if (status === "Absent") {
            return {
                backgroundColor: "#fee2e2",
                color: "#991b1b"
            };
        }

        if (status === "Late") {
            return {
                backgroundColor: "#fef3c7",
                color: "#92400e"
            };
        }

        return {
            backgroundColor: "#dbeafe",
            color: "#1e40af"
        };
    };

    // =========================
    // UI
    // =========================

    return (
        <div
            style={{
                padding: "30px",
                minHeight: "100vh",
                backgroundColor: "#f4f6f9",
                boxSizing: "border-box"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    marginBottom: "25px"
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        color: "#1f2937"
                    }}
                >
                    Attendance Management
                </h1>

                <p
                    style={{
                        color: "#64748b",
                        marginTop: "8px"
                    }}
                >
                    Manage employee attendance records.
                </p>
            </div>

            {/* SUCCESS MESSAGE */}

            {message && (
                <div
                    style={{
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        padding: "12px 15px",
                        borderRadius: "8px",
                        marginBottom: "20px"
                    }}
                >
                    {message}
                </div>
            )}

            {/* ERROR MESSAGE */}

            {error && (
                <div
                    style={{
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        padding: "12px 15px",
                        borderRadius: "8px",
                        marginBottom: "20px"
                    }}
                >
                    {error}
                </div>
            )}

            {/* FORM */}

            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "25px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                    marginBottom: "30px"
                }}
            >

                <h2
                    style={{
                        marginTop: 0,
                        marginBottom: "20px",
                        color: "#1f2937"
                    }}
                >
                    {editingId
                        ? "Edit Attendance"
                        : "Mark Attendance"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "18px"
                        }}
                    >

                        {/* EMPLOYEE */}

                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontWeight: "600",
                                    fontSize: "14px"
                                }}
                            >
                                Employee
                            </label>

                            <select
                                name="employee_id"
                                value={formData.employee_id}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            >
                                <option value="">
                                    Select Employee
                                </option>

                                {employees.map((employee) => (
                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {employee.fullName} (
                                        {employee.userid}
                                        )
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* DATE */}

                        <div>
                            <label
                                style={labelStyle}
                            >
                                Attendance Date
                            </label>

                            <input
                                type="date"
                                name="attendance_date"
                                value={formData.attendance_date}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        {/* CHECK IN */}

                        <div>
                            <label
                                style={labelStyle}
                            >
                                Check In
                            </label>

                            <input
                                type="time"
                                name="check_in"
                                value={formData.check_in}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>

                        {/* CHECK OUT */}

                        <div>
                            <label
                                style={labelStyle}
                            >
                                Check Out
                            </label>

                            <input
                                type="time"
                                name="check_out"
                                value={formData.check_out}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>

                        {/* STATUS */}

                        <div>
                            <label
                                style={labelStyle}
                            >
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            >
                                <option value="Present">
                                    Present
                                </option>

                                <option value="Absent">
                                    Absent
                                </option>

                                <option value="Late">
                                    Late
                                </option>

                                <option value="Half Day">
                                    Half Day
                                </option>
                            </select>
                        </div>

                    </div>

                    {/* BUTTONS */}

                    <div
                        style={{
                            marginTop: "22px",
                            display: "flex",
                            gap: "10px"
                        }}
                    >

                        <button
                            type="submit"
                            style={primaryButton}
                        >
                            {editingId
                                ? "Update Attendance"
                                : "Mark Attendance"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                style={secondaryButton}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>
            </div>

            {/* TABLE */}

            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                    overflow: "hidden"
                }}
            >

                <div
                    style={{
                        padding: "20px 25px",
                        borderBottom: "1px solid #e5e7eb"
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            color: "#1f2937"
                        }}
                    >
                        Attendance Records
                    </h2>
                </div>

                {loading ? (

                    <div
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            color: "#64748b"
                        }}
                    >
                        Loading attendance...
                    </div>

                ) : attendance.length === 0 ? (

                    <div
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            color: "#64748b"
                        }}
                    >
                        No attendance records found.
                    </div>

                ) : (

                    <div
                        style={{
                            overflowX: "auto"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                minWidth: "900px",
                                borderCollapse: "collapse"
                            }}
                        >

                            <thead
                                style={{
                                    backgroundColor: "#f8fafc"
                                }}
                            >
                                <tr>

                                    <th style={tableHeader}>
                                        ID
                                    </th>

                                    <th style={tableHeader}>
                                        Employee
                                    </th>

                                    <th style={tableHeader}>
                                        User ID
                                    </th>

                                    <th style={tableHeader}>
                                        Department
                                    </th>

                                    <th style={tableHeader}>
                                        Date
                                    </th>

                                    <th style={tableHeader}>
                                        Check In
                                    </th>

                                    <th style={tableHeader}>
                                        Check Out
                                    </th>

                                    <th style={tableHeader}>
                                        Status
                                    </th>

                                    <th style={tableHeader}>
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {attendance.map((record) => (

                                    <tr
                                        key={record.id}
                                        style={{
                                            borderBottom:
                                                "1px solid #f1f5f9"
                                        }}
                                    >

                                        <td style={tableCell}>
                                            {record.id}
                                        </td>

                                        <td
                                            style={{
                                                ...tableCell,
                                                fontWeight: "600",
                                                color: "#1f2937"
                                            }}
                                        >
                                            {record.fullName}
                                        </td>

                                        <td style={tableCell}>
                                            {record.userid}
                                        </td>

                                        <td style={tableCell}>
                                            {record.department}
                                        </td>

                                        <td style={tableCell}>
                                            {record.attendance_date}
                                        </td>

                                        <td style={tableCell}>
                                            {record.check_in || "-"}
                                        </td>

                                        <td style={tableCell}>
                                            {record.check_out || "-"}
                                        </td>

                                        <td style={tableCell}>

                                            <span
                                                style={{
                                                    ...getStatusStyle(
                                                        record.status
                                                    ),
                                                    display: "inline-block",
                                                    padding: "5px 10px",
                                                    borderRadius: "20px",
                                                    fontSize: "12px",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {record.status}
                                            </span>

                                        </td>

                                        <td style={tableCell}>

                                            <button
                                                onClick={() =>
                                                    handleEdit(record)
                                                }
                                                style={{
                                                    marginRight: "8px",
                                                    padding: "7px 12px",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    backgroundColor: "#2563eb",
                                                    color: "#ffffff",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(record.id)
                                                }
                                                style={{
                                                    padding: "7px 12px",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    backgroundColor: "#dc2626",
                                                    color: "#ffffff",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}


// =========================
// STYLES
// =========================

const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff"
};

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: "600",
    fontSize: "14px"
};

const primaryButton = {
    padding: "10px 18px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer"
};

const secondaryButton = {
    padding: "10px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    backgroundColor: "#ffffff",
    color: "#374151",
    fontWeight: "600",
    cursor: "pointer"
};

const tableHeader = {
    padding: "14px 18px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    whiteSpace: "nowrap"
};

const tableCell = {
    padding: "14px 18px",
    fontSize: "14px",
    color: "#475569",
    whiteSpace: "nowrap"
};

export default Attendance;