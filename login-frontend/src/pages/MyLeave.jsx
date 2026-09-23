import { useEffect, useState } from "react";
import api from "../api/api";
import "./MyLeave.css";

function MyLeave() {

    const [leaves, setLeaves] = useState([]);

    const [leaveType, setLeaveType] = useState("Casual Leave");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyLeaves();
    }, []);

    const fetchMyLeaves = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/leaves/me");

            setLeaves(response.data.leaves || []);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load leave requests"
            );

        } finally {

            setLoading(false);

        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!fromDate || !toDate) {
            alert("Please select from and to dates");
            return;
        }

        if (fromDate > toDate) {
            alert("From date cannot be after To date");
            return;
        }

        try {

            setSubmitting(true);

            await api.post("/leaves", {
                leave_type: leaveType,
                from_date: fromDate,
                to_date: toDate,
                reason
            });

            alert("Leave request submitted successfully");

            setLeaveType("Casual Leave");
            setFromDate("");
            setToDate("");
            setReason("");

            fetchMyLeaves();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to submit leave request"
            );

        } finally {

            setSubmitting(false);

        }
    };

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const getStatusClass = (status) => {

        return status
            ?.toLowerCase()
            .replace(" ", "-");
    };

    return (

        <div className="my-leave-page">

            {/* HEADER */}

            <div className="my-leave-header">

                <div>

                    <p className="my-leave-eyebrow">
                        EMPLOYEE PORTAL
                    </p>

                    <h1>My Leave</h1>

                    <p>
                        Apply for leave and track your leave requests.
                    </p>

                </div>

                <button
                    className="leave-refresh-btn"
                    onClick={fetchMyLeaves}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* SUMMARY */}

            <div className="leave-summary">

                <div className="leave-summary-card total">

                    <span>▣</span>

                    <div>
                        <small>Total Requests</small>
                        <strong>{leaves.length}</strong>
                    </div>

                </div>


                <div className="leave-summary-card pending">

                    <span>◷</span>

                    <div>
                        <small>Pending</small>
                        <strong>
                            {
                                leaves.filter(
                                    item => item.status === "Pending"
                                ).length
                            }
                        </strong>
                    </div>

                </div>


                <div className="leave-summary-card approved">

                    <span>✓</span>

                    <div>
                        <small>Approved</small>
                        <strong>
                            {
                                leaves.filter(
                                    item => item.status === "Approved"
                                ).length
                            }
                        </strong>
                    </div>

                </div>


                <div className="leave-summary-card rejected">

                    <span>!</span>

                    <div>
                        <small>Rejected</small>
                        <strong>
                            {
                                leaves.filter(
                                    item => item.status === "Rejected"
                                ).length
                            }
                        </strong>
                    </div>

                </div>

            </div>


            {/* APPLY LEAVE */}

            <section className="leave-form-section">

                <div className="leave-section-header">

                    <div>

                        <h2>Apply for Leave</h2>

                        <p>
                            Submit a new leave request for approval.
                        </p>

                    </div>

                </div>


                <form
                    className="leave-form"
                    onSubmit={handleSubmit}
                >

                    <div className="leave-form-grid">

                        <div className="leave-form-group">

                            <label>Leave Type</label>

                            <select
                                value={leaveType}
                                onChange={(e) =>
                                    setLeaveType(e.target.value)
                                }
                            >

                                <option>Casual Leave</option>
                                <option>Sick Leave</option>
                                <option>Earned Leave</option>
                                <option>Other</option>

                            </select>

                        </div>


                        <div className="leave-form-group">

                            <label>From Date</label>

                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) =>
                                    setFromDate(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="leave-form-group">

                            <label>To Date</label>

                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) =>
                                    setToDate(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="leave-form-group full">

                            <label>Reason</label>

                            <textarea
                                rows="3"
                                placeholder="Enter reason for leave..."
                                value={reason}
                                onChange={(e) =>
                                    setReason(e.target.value)
                                }
                            />

                        </div>

                    </div>


                    <div className="leave-form-actions">

                        <button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Leave Request"}
                        </button>

                    </div>

                </form>

            </section>


            {/* LEAVE HISTORY */}

            <section className="leave-history-section">

                <div className="leave-section-header">

                    <div>

                        <h2>My Leave Requests</h2>

                        <p>
                            Track your submitted leave requests and approval status.
                        </p>

                    </div>

                </div>


                {loading && (

                    <div className="leave-state">

                        <div className="leave-loader"></div>

                        <p>Loading leave requests...</p>

                    </div>

                )}


                {!loading && error && (

                    <div className="leave-state error">

                        <span>!</span>

                        <p>{error}</p>

                        <button onClick={fetchMyLeaves}>
                            Try Again
                        </button>

                    </div>

                )}


                {!loading &&
                    !error &&
                    leaves.length === 0 && (

                        <div className="leave-state">

                            <span>▣</span>

                            <h3>No leave requests</h3>

                            <p>
                                Your leave requests will appear here.
                            </p>

                        </div>

                    )}


                {!loading &&
                    !error &&
                    leaves.length > 0 && (

                        <div className="leave-table-wrapper">

                            <table className="my-leave-table">

                                <thead>

                                    <tr>
                                        <th>Leave Type</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {leaves.map((leave) => (

                                        <tr key={leave.id}>

                                            <td>
                                                <strong>
                                                    {leave.leave_type}
                                                </strong>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    leave.from_date
                                                )}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    leave.to_date
                                                )}
                                            </td>

                                            <td className="leave-reason">
                                                {leave.reason || "-"}
                                            </td>

                                            <td>

                                                <span
                                                    className={`leave-status ${getStatusClass(
                                                        leave.status
                                                    )}`}
                                                >
                                                    {leave.status}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

            </section>

        </div>
    );
}

export default MyLeave;