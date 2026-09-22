
import { useEffect, useState } from "react";
import api from "../api/api";

function Leave() {

    // ==============================
    // EMPLOYEES
    // ==============================

    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);

    // ==============================
    // LEAVES
    // ==============================

    const [leaves, setLeaves] = useState([]);
    const [loadingLeaves, setLoadingLeaves] = useState(true);

    // ==============================
    // FORM
    // ==============================

    const [formData, setFormData] = useState({
        employee_id: "",
        leave_type: "Casual Leave",
        from_date: "",
        to_date: "",
        reason: ""
    });

    const [editingId, setEditingId] = useState(null);

    // ==============================
    // UI STATE
    // ==============================

    const [submitting, setSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==============================
    // SEARCH / FILTER
    // ==============================

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // ==============================
    // INITIAL LOAD
    // ==============================

    useEffect(() => {
        fetchEmployees();
        fetchLeaves();
    }, []);

    // ==============================
    // FETCH EMPLOYEES
    // ==============================

    const fetchEmployees = async () => {

        try {

            setLoadingEmployees(true);

            const response = await api.get("/users");

            setEmployees(response.data || []);

        } catch (error) {

            console.log("Employee fetch error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load employees"
            );

        } finally {

            setLoadingEmployees(false);

        }
    };

    // ==============================
    // FETCH LEAVES
    // ==============================

    const fetchLeaves = async () => {

        try {

            setLoadingLeaves(true);

            const response = await api.get("/leaves");

            setLeaves(response.data.leaves || []);

        } catch (error) {

            console.log("Leave fetch error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load leave requests"
            );

        } finally {

            setLoadingLeaves(false);

        }
    };

    // ==============================
    // FORM CHANGE
    // ==============================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };

    // ==============================
    // RESET FORM
    // ==============================

    const resetForm = () => {

        setFormData({
            employee_id: "",
            leave_type: "Casual Leave",
            from_date: "",
            to_date: "",
            reason: ""
        });

        setEditingId(null);

    };

    // ==============================
    // SUBMIT / UPDATE LEAVE
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        // ------------------------------
        // FRONTEND VALIDATION
        // ------------------------------

        if (
            !formData.employee_id ||
            !formData.leave_type ||
            !formData.from_date ||
            !formData.to_date
        ) {

            setError(
                "Employee, leave type, from date and to date are required"
            );

            return;
        }

        if (formData.from_date > formData.to_date) {

            setError(
                "From date cannot be after to date"
            );

            return;
        }

        try {

            setSubmitting(true);

            // ==========================
            // EDIT
            // ==========================

            if (editingId) {

                const response = await api.put(
                    `/leaves/${editingId}`,
                    {
                        employee_id: Number(formData.employee_id),
                        leave_type: formData.leave_type,
                        from_date: formData.from_date,
                        to_date: formData.to_date,
                        reason: formData.reason
                    }
                );

                setMessage(
                    response.data.message ||
                    "Leave request updated successfully"
                );

            }

            // ==========================
            // CREATE
            // ==========================

            else {

                const response = await api.post(
                    "/leaves",
                    {
                        employee_id: Number(formData.employee_id),
                        leave_type: formData.leave_type,
                        from_date: formData.from_date,
                        to_date: formData.to_date,
                        reason: formData.reason
                    }
                );

                setMessage(
                    response.data.message ||
                    "Leave request submitted successfully"
                );

            }

            resetForm();

            await fetchLeaves();

        } catch (error) {

            console.log("Leave submit error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to save leave request"
            );

        } finally {

            setSubmitting(false);

        }

    };

    // ==============================
    // EDIT
    // ==============================

    const handleEdit = (leave) => {

        setMessage("");
        setError("");

        setEditingId(leave.id);

        setFormData({
            employee_id: String(leave.employee_id),
            leave_type: leave.leave_type,
            from_date: formatDateForInput(leave.from_date),
            to_date: formatDateForInput(leave.to_date),
            reason: leave.reason || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    // ==============================
    // DELETE
    // ==============================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this leave request?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            setMessage("");
            setError("");

            const response = await api.delete(
                `/leaves/${id}`
            );

            setMessage(
                response.data.message ||
                "Leave request deleted successfully"
            );

            await fetchLeaves();

        } catch (error) {

            console.log("Delete leave error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete leave request"
            );

        } finally {

            setActionLoading(false);

        }

    };

    // ==============================
    // APPROVE LEAVE
    // ==============================

    const handleApprove = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to approve this leave request?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            setMessage("");
            setError("");

            const response = await api.put(
                `/leaves/${id}/status`,
                {
                    status: "Approved"
                }
            );

            setMessage(
                response.data.message ||
                "Leave request approved successfully"
            );

            await fetchLeaves();

        } catch (error) {

            console.log("Approve leave error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to approve leave request"
            );

        } finally {

            setActionLoading(false);

        }

    };

    // ==============================
    // REJECT LEAVE
    // ==============================

    const handleReject = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to reject this leave request?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            setMessage("");
            setError("");

            const response = await api.put(
                `/leaves/${id}/status`,
                {
                    status: "Rejected"
                }
            );

            setMessage(
                response.data.message ||
                "Leave request rejected successfully"
            );

            await fetchLeaves();

        } catch (error) {

            console.log("Reject leave error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to reject leave request"
            );

        } finally {

            setActionLoading(false);

        }

    };

    // ==============================
    // CANCEL EDIT
    // ==============================

    const handleCancelEdit = () => {

        resetForm();

        setMessage("");
        setError("");

    };

    // ==============================
    // SEARCH + STATUS FILTER
    // ==============================

    const filteredLeaves = leaves.filter((leave) => {

        const search = searchTerm.toLowerCase();

        const matchesSearch =
            leave.fullName?.toLowerCase().includes(search) ||
            leave.userid?.toLowerCase().includes(search) ||
            leave.department?.toLowerCase().includes(search) ||
            leave.leave_type?.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "All" ||
            leave.status === statusFilter;

        return matchesSearch && matchesStatus;

    });

    // ==============================
    // FORMAT DATE
    // ==============================

    const formatDateForInput = (date) => {

        if (!date) {
            return "";
        }

        return String(date).substring(0, 10);

    };

    const formatDisplayDate = (date) => {

        if (!date) {
            return "-";
        }

        const formattedDate = String(date).substring(0, 10);

        const [year, month, day] = formattedDate.split("-");

        return `${day}-${month}-${year}`;

    };

    // ==============================
    // STATUS STYLE
    // ==============================

    const getStatusStyle = (status) => {

        if (status === "Approved") {

            return {
                backgroundColor: "#d1fae5",
                color: "#065f46"
            };

        }

        if (status === "Rejected") {

            return {
                backgroundColor: "#fee2e2",
                color: "#991b1b"
            };

        }

        return {
            backgroundColor: "#fef3c7",
            color: "#92400e"
        };

    };

    // ==============================
    // TABLE STYLES
    // ==============================

    const tableHeaderStyle = {
        padding: "12px",
        textAlign: "left",
        borderBottom: "2px solid #ddd",
        backgroundColor: "#f8fafc",
        whiteSpace: "nowrap"
    };

    const tableCellStyle = {
        padding: "12px",
        borderBottom: "1px solid #eee",
        verticalAlign: "top"
    };

    const inputStyle = {
        display: "block",
        width: "100%",
        padding: "10px",
        marginTop: "6px",
        boxSizing: "border-box",
        border: "1px solid #d1d5db",
        borderRadius: "6px"
    };

    const buttonStyle = {
        padding: "9px 14px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        marginRight: "6px",
        marginBottom: "5px"
    };

    // ==============================
    // UI
    // ==============================

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "1400px",
                margin: "0 auto"
            }}
        >

            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div style={{ marginBottom: "25px" }}>

                <h1 style={{ marginBottom: "8px" }}>
                    Leave Management
                </h1>

                <p style={{ color: "#6b7280" }}>
                    Submit, review and manage employee leave requests.
                </p>

            </div>

            {/* =====================================
                SUCCESS MESSAGE
            ===================================== */}

            {message && (

                <div
                    style={{
                        padding: "12px 15px",
                        marginBottom: "20px",
                        backgroundColor: "#d1fae5",
                        color: "#065f46",
                        borderRadius: "6px"
                    }}
                >
                    {message}
                </div>

            )}

            {/* =====================================
                ERROR MESSAGE
            ===================================== */}

            {error && (

                <div
                    style={{
                        padding: "12px 15px",
                        marginBottom: "20px",
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        borderRadius: "6px"
                    }}
                >
                    {error}
                </div>

            )}

            {/* =====================================
                APPLY / EDIT LEAVE
            ===================================== */}

            <div
                style={{
                    backgroundColor: "white",
                    padding: "25px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}
                >

                    <h2 style={{ margin: 0 }}>
                        {editingId
                            ? "Edit Leave Request"
                            : "Apply Leave"}
                    </h2>

                    {editingId && (

                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            style={{
                                ...buttonStyle,
                                backgroundColor: "#6b7280",
                                color: "white"
                            }}
                        >
                            Cancel Edit
                        </button>

                    )}

                </div>

                <form onSubmit={handleSubmit}>

                    {/* Employee */}

                    <div style={{ marginBottom: "18px" }}>

                        <label>
                            <strong>Employee</strong>
                        </label>

                        <select
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            disabled={
                                loadingEmployees ||
                                submitting
                            }
                            style={inputStyle}
                        >

                            <option value="">
                                {loadingEmployees
                                    ? "Loading employees..."
                                    : "Select Employee"}
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

                    {/* Leave Type */}

                    <div style={{ marginBottom: "18px" }}>

                        <label>
                            <strong>Leave Type</strong>
                        </label>

                        <select
                            name="leave_type"
                            value={formData.leave_type}
                            onChange={handleChange}
                            disabled={submitting}
                            style={inputStyle}
                        >

                            <option value="Casual Leave">
                                Casual Leave
                            </option>

                            <option value="Sick Leave">
                                Sick Leave
                            </option>

                            <option value="Earned Leave">
                                Earned Leave
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>

                    {/* Dates */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "20px"
                        }}
                    >

                        <div style={{ marginBottom: "18px" }}>

                            <label>
                                <strong>From Date</strong>
                            </label>

                            <input
                                type="date"
                                name="from_date"
                                value={formData.from_date}
                                onChange={handleChange}
                                disabled={submitting}
                                style={inputStyle}
                            />

                        </div>

                        <div style={{ marginBottom: "18px" }}>

                            <label>
                                <strong>To Date</strong>
                            </label>

                            <input
                                type="date"
                                name="to_date"
                                value={formData.to_date}
                                onChange={handleChange}
                                disabled={submitting}
                                style={inputStyle}
                            />

                        </div>

                    </div>

                    {/* Reason */}

                    <div style={{ marginBottom: "20px" }}>

                        <label>
                            <strong>Reason</strong>
                        </label>

                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Enter reason for leave"
                            rows="4"
                            disabled={submitting}
                            style={{
                                ...inputStyle,
                                resize: "vertical"
                            }}
                        />

                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            ...buttonStyle,
                            backgroundColor: "#3e7fe7",
                            color: "white",
                            cursor: submitting
                                ? "not-allowed"
                                : "pointer"
                        }}
                    >

                        {submitting
                            ? "Saving..."
                            : editingId
                                ? "Update Leave Request"
                                : "Submit Leave Request"}

                    </button>

                </form>

            </div>

            {/* =====================================
                LEAVE REQUESTS
            ===================================== */}

            <div
                style={{
                    marginTop: "30px",
                    backgroundColor: "white",
                    padding: "25px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}
            >

                {/* Table Header */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap"
                    }}
                >

                    <div>

                        <h2 style={{ margin: 0 }}>
                            Leave Requests
                        </h2>

                        <p
                            style={{
                                marginTop: "6px",
                                color: "#6b7280"
                            }}
                        >
                            Total: {filteredLeaves.length}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={fetchLeaves}
                        disabled={loadingLeaves}
                        style={{
                            ...buttonStyle,
                            backgroundColor: "#111827",
                            color: "white"
                        }}
                    >
                        {loadingLeaves
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </div>

                {/* Search + Filter */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "15px",
                        marginTop: "15px",
                        marginBottom: "20px"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Search employee, ID, department or leave type..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        style={inputStyle}
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Approved">
                            Approved
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                    </select>

                </div>

                {/* Table */}

                {loadingLeaves ? (

                    <p>Loading leave requests...</p>

                ) : filteredLeaves.length === 0 ? (

                    <p>
                        No leave requests found.
                    </p>

                ) : (

                    <div
                        style={{
                            overflowX: "auto"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                minWidth: "1100px"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th style={tableHeaderStyle}>
                                        Employee
                                    </th>

                                    <th style={tableHeaderStyle}>
                                        Department
                                    </th>

                                    <th style={tableHeaderStyle}>
                                        Leave Type
                                    </th>

                                    <th style={tableHeaderStyle}>
                                        From
                                    </th>

                                    <th style={tableHeaderStyle}>
                                        To
                                    </th>

                                    <th style={tableHeaderStyle}>
                                        Reason
                                    </th>

                                    <th style={tableHeaderStyle}>
                                        Status
                                    </th>

                                    <th style={tableHeaderStyle}>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredLeaves.map((leave) => {

                                    const statusStyle =
                                        getStatusStyle(
                                            leave.status
                                        );

                                    return (

                                        <tr key={leave.id}>

                                            {/* Employee */}

                                            <td style={tableCellStyle}>

                                                <strong>
                                                    {leave.fullName}
                                                </strong>

                                                <br />

                                                <small
                                                    style={{
                                                        color: "#6b7280"
                                                    }}
                                                >
                                                    {leave.userid}
                                                </small>

                                            </td>

                                            {/* Department */}

                                            <td style={tableCellStyle}>
                                                {leave.department || "-"}
                                            </td>

                                            {/* Leave Type */}

                                            <td style={tableCellStyle}>
                                                {leave.leave_type}
                                            </td>

                                            {/* From */}

                                            <td style={tableCellStyle}>
                                                {formatDisplayDate(
                                                    leave.from_date
                                                )}
                                            </td>

                                            {/* To */}

                                            <td style={tableCellStyle}>
                                                {formatDisplayDate(
                                                    leave.to_date
                                                )}
                                            </td>

                                            {/* Reason */}

                                            <td style={tableCellStyle}>
                                                {leave.reason || "-"}
                                            </td>

                                            {/* Status */}

                                            <td style={tableCellStyle}>

                                                <span
                                                    style={{
                                                        ...statusStyle,
                                                        display:
                                                            "inline-block",
                                                        padding:
                                                            "5px 10px",
                                                        borderRadius:
                                                            "15px",
                                                        fontSize:
                                                            "13px",
                                                        fontWeight:
                                                            "600"
                                                    }}
                                                >
                                                    {leave.status}
                                                </span>

                                            </td>

                                            {/* Actions */}

                                            <td style={tableCellStyle}>

                                                {/* Approve */}

                                                {leave.status ===
                                                    "Pending" && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleApprove(
                                                                leave.id
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        style={{
                                                            ...buttonStyle,
                                                            backgroundColor:
                                                                "#16a34a",
                                                            color:
                                                                "white"
                                                        }}
                                                    >
                                                        Approve
                                                    </button>

                                                )}

                                                {/* Reject */}

                                                {leave.status ===
                                                    "Pending" && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleReject(
                                                                leave.id
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        style={{
                                                            ...buttonStyle,
                                                            backgroundColor:
                                                                "#dc2626",
                                                            color:
                                                                "white"
                                                        }}
                                                    >
                                                        Reject
                                                    </button>

                                                )}

                                                {/* Edit */}

                                                {leave.status ===
                                                    "Pending" && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                leave
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        style={{
                                                            ...buttonStyle,
                                                            backgroundColor:
                                                                "#2563eb",
                                                            color:
                                                                "white"
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                )}

                                                {/* Delete */}

                                                {leave.status ===
                                                    "Pending" && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                leave.id
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        style={{
                                                            ...buttonStyle,
                                                            backgroundColor:
                                                                "#6b7280",
                                                            color:
                                                                "white"
                                                        }}
                                                    >
                                                        Delete
                                                    </button>

                                                )}

                                                {leave.status !==
                                                    "Pending" && (

                                                    <span
                                                        style={{
                                                            color:
                                                                "#6b7280",
                                                            fontSize:
                                                                "13px"
                                                        }}
                                                    >
                                                        No actions
                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Leave;
