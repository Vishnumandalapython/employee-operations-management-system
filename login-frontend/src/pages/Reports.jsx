import { useEffect, useState } from "react";
import api from "../api/api";
import "./Reports.css";

function Reports() {

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================
    // FETCH REPORT
    // =========================================

    useEffect(() => {

        const fetchReport = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(
                    "/reports/summary"
                );

                setReport(response.data.data);

            } catch (err) {

                console.log(
                    "Reports error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load reports"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchReport();

    }, []);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="reports-page">

                <div className="reports-loading">

                    <div className="reports-spinner"></div>

                    <p>
                        Loading reports...
                    </p>

                </div>

            </div>
        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (
            <div className="reports-page">

                <div className="reports-error">

                    <div className="reports-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to Load Reports
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );

    }


    // =========================================
    // SAFETY
    // =========================================

    if (!report) {
        return null;
    }


    const employees =
        report.employees || {};

    const attendance =
        report.attendance || {};

    const leaves =
        report.leaves || {};

    const announcements =
        report.announcements || [];


    // =========================================
    // UI
    // =========================================

    return (

        <div className="reports-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="reports-header">

                <div>

                    <div className="reports-eyebrow">
                        ANALYTICS
                    </div>

                    <h1>
                        Reports & Insights
                    </h1>

                    <p>
                        Overview of employee operations,
                        attendance, leave and announcements.
                    </p>

                </div>

            </div>


            {/* =================================
                EMPLOYEE SUMMARY
            ================================= */}

            <section className="report-section">

                <div className="section-heading">

                    <h2>
                        Employee Summary
                    </h2>

                    <p>
                        Current employee overview
                    </p>

                </div>


                <div className="summary-grid">

                    <div className="summary-card">

                        <div className="summary-icon employee-icon">
                            👥
                        </div>

                        <div>

                            <span className="summary-label">
                                Total Employees
                            </span>

                            <strong>
                                {employees.totalEmployees ?? 0}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon active-icon">
                            ✓
                        </div>

                        <div>

                            <span className="summary-label">
                                Active Employees
                            </span>

                            <strong>
                                {employees.activeEmployees ?? 0}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================
                ATTENDANCE
            ================================= */}

            <section className="report-section">

                <div className="section-heading">

                    <h2>
                        Attendance Overview
                    </h2>

                    <p>
                        Attendance records by status
                    </p>

                </div>


                <div className="summary-grid four-columns">

                    <div className="summary-card">

                        <div className="summary-icon present-icon">
                            ✓
                        </div>

                        <div>

                            <span className="summary-label">
                                Present
                            </span>

                            <strong>
                                {attendance.present ?? 0}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon absent-icon">
                            ×
                        </div>

                        <div>

                            <span className="summary-label">
                                Absent
                            </span>

                            <strong>
                                {attendance.absent ?? 0}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon late-icon">
                            !
                        </div>

                        <div>

                            <span className="summary-label">
                                Late
                            </span>

                            <strong>
                                {attendance.late ?? 0}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon halfday-icon">
                            ◐
                        </div>

                        <div>

                            <span className="summary-label">
                                Half Day
                            </span>

                            <strong>
                                {attendance.halfDay ?? 0}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================
                LEAVE
            ================================= */}

            <section className="report-section">

                <div className="section-heading">

                    <h2>
                        Leave Overview
                    </h2>

                    <p>
                        Leave requests by status
                    </p>

                </div>


                <div className="summary-grid three-columns">

                    <div className="summary-card">

                        <div className="summary-icon pending-icon">
                            ◷
                        </div>

                        <div>

                            <span className="summary-label">
                                Pending
                            </span>

                            <strong>
                                {leaves.pending ?? 0}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon approved-icon">
                            ✓
                        </div>

                        <div>

                            <span className="summary-label">
                                Approved
                            </span>

                            <strong>
                                {leaves.approved ?? 0}
                            </strong>

                        </div>

                    </div>


                    <div className="summary-card">

                        <div className="summary-icon rejected-icon">
                            ×
                        </div>

                        <div>

                            <span className="summary-label">
                                Rejected
                            </span>

                            <strong>
                                {leaves.rejected ?? 0}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================
                ANNOUNCEMENTS
            ================================= */}

            <section className="report-section">

                <div className="section-heading">

                    <h2>
                        Recent Announcements
                    </h2>

                    <p>
                        Latest employee communications
                    </p>

                </div>


                <div className="recent-announcements">

                    {announcements.length === 0 ? (

                        <div className="no-announcements">
                            No announcements available.
                        </div>

                    ) : (

                        announcements.map((announcement) => (

                            <div
                                className="report-announcement"
                                key={announcement.id}
                            >

                                <div className="report-announcement-icon">
                                    📢
                                </div>

                                <div>

                                    <h3>
                                        {announcement.title}
                                    </h3>

                                    <p>
                                        {announcement.body}
                                    </p>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </section>

        </div>

    );

}

export default Reports;