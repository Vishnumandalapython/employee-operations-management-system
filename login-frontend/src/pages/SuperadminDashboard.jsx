
import { useEffect, useState } from "react";
import api from "../api/api";

function SuperadminDashboard() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // ===============================
    // GET USERS
    // ===============================

    const getUsers = async () => {

        try {

            const response = await api.get("/users");

            setUsers(response.data);

        } catch (error) {

            console.log("GET USERS ERROR:", error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    // ===============================
    // USER STATISTICS
    // ===============================

   const totalEmployees = users.length;

const activeEmployees = users.filter(
    (u) => u.status === "Active"
).length;

const inactiveEmployees = users.filter(
    (u) => u.status === "Inactive"
).length;

const totalDepartments = new Set(
    users
        .map((u) => u.department)
        .filter(Boolean)
).size;
    // ===============================
    // SEARCH USERS
    // ===============================

    const filteredUsers = users.filter((item) => {

        const value = search.toLowerCase();

        return (
            item.fullName?.toLowerCase().includes(value) ||
            item.userid?.toLowerCase().includes(value) ||
            item.role?.toLowerCase().includes(value)
        );

    });

    return (

        <div style={styles.app}>

           


            {/* MAIN CONTENT */}

            <main style={styles.main}>

                {/* ===============================
                    HEADER
                =============================== */}

                <div style={styles.header}>

                    <div>

                        <p style={styles.pageLabel}>
                            ADMIN PANEL
                        </p>

                        <h1 style={styles.pageTitle}>
                            Dashboard
                        </h1>

                        <p style={styles.pageDescription}>
                            Manage users and monitor application data.
                        </p>

                    </div>


                    <div style={styles.currentUser}>

                        <div style={styles.avatar}>
                            {user?.fullName
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div>

                            <strong>
                                {user?.fullName}
                            </strong>

                            <p style={styles.userRole}>
                                {user?.role}
                            </p>

                        </div>

                    </div>

                </div>


              

                {/* ===============================
                    POC TECHNICAL FLOW
                =============================== */}

               <section>

    <h2 style={styles.sectionTitle}>
        Overview
    </h2>

    <div style={styles.cards}>

        {/* TOTAL EMPLOYEES */}

        <div style={styles.card}>

            <div style={styles.cardTop}>

                <span style={styles.cardIcon}>
                    👥
                </span>

                <span style={styles.cardRoute}>
                    EMPLOYEES
                </span>

            </div>

            <h3 style={styles.cardNumber}>
                {totalEmployees}
            </h3>

            <p style={styles.cardName}>
                Total Employees
            </p>

            <p style={styles.cardInfo}>
                All registered employees
            </p>

        </div>


        {/* ACTIVE EMPLOYEES */}

        <div style={styles.card}>

            <div style={styles.cardTop}>

                <span style={styles.cardIcon}>
                    ✓
                </span>

                <span style={styles.cardRoute}>
                    STATUS
                </span>

            </div>

            <h3 style={styles.cardNumber}>
                {activeEmployees}
            </h3>

            <p style={styles.cardName}>
                Active Employees
            </p>

            <p style={styles.cardInfo}>
                Currently active employees
            </p>

        </div>


        {/* INACTIVE EMPLOYEES */}

        <div style={styles.card}>

            <div style={styles.cardTop}>

                <span style={styles.cardIcon}>
                    ⏸
                </span>

                <span style={styles.cardRoute}>
                    STATUS
                </span>

            </div>

            <h3 style={styles.cardNumber}>
                {inactiveEmployees}
            </h3>

            <p style={styles.cardName}>
                Inactive Employees
            </p>

            <p style={styles.cardInfo}>
                Currently inactive employees
            </p>

        </div>


        {/* DEPARTMENTS */}

        <div style={styles.card}>

            <div style={styles.cardTop}>

                <span style={styles.cardIcon}>
                    🏢
                </span>

                <span style={styles.cardRoute}>
                    ORGANIZATION
                </span>

            </div>

            <h3 style={styles.cardNumber}>
                {totalDepartments}
            </h3>

            <p style={styles.cardName}>
                Departments
            </p>

            <p style={styles.cardInfo}>
                Departments in the system
            </p>

        </div>

    </div>

</section>
<section style={styles.moduleSection}>

    <h2 style={styles.sectionTitle}>
        Recent Employees
    </h2>

    <div style={styles.recentCard}>

        {loading ? (

            <p>Loading employees...</p>

        ) : users.length === 0 ? (

            <p>No employees found.</p>

        ) : (

            <table style={styles.recentTable}>

               <thead style={styles.recentTableHeader}>
    <tr>
        <th style={styles.recentTableHeaderCell}>
            Employee
        </th>

        <th style={styles.recentTableHeaderCell}>
            User ID
        </th>

        <th style={styles.recentTableHeaderCell}>
            Department
        </th>

        <th style={styles.recentTableHeaderCell}>
            Role
        </th>

        <th style={styles.recentTableHeaderCell}>
            Status
        </th>
    </tr>
</thead>

                <tbody>

                    {users.slice(0, 5).map((employee) => (

                       <tr
    key={employee.id}
    style={styles.recentTableRow}
>
    <td style={styles.recentTableCell}>
        <span style={styles.employeeName}>
            {employee.fullName}
        </span>
    </td>

    <td style={styles.recentTableCell}>
        <span style={styles.employeeId}>
            {employee.userid}
        </span>
    </td>

    <td style={styles.recentTableCell}>
        <span style={styles.departmentBadge}>
            {employee.department || "Not Assigned"}
        </span>
    </td>

    <td style={styles.recentTableCell}>
        {employee.role}
    </td>

    <td style={styles.recentTableCell}>
        <span
            style={{
                ...styles.statusBadge,
                backgroundColor:
                    employee.status === "Active"
                        ? "#dcfce7"
                        : "#fee2e2",
                color:
                    employee.status === "Active"
                        ? "#15803d"
                        : "#b91c1c"
            }}
        >
            ● {employee.status}
        </span>
    </td>
</tr>

                    ))}

                </tbody>

            </table>

        )}

    </div>

</section>
                <footer style={styles.footer}>
                    Mini Admin Management System
                </footer>

            </main>

        </div>
    );
}
export default SuperadminDashboard;

const styles = {

    /* ===============================
       MAIN LAYOUT
    =============================== */

    app: {
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        fontFamily: "Arial, sans-serif"
    },

    main: {
        flex: 1,
        minWidth: 0,
        padding: "30px",
        boxSizing: "border-box"
    },


    /* ===============================
       HEADER
    =============================== */

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        gap: "20px"
    },

    pageLabel: {
        margin: "0 0 6px 0",
        fontSize: "12px",
        fontWeight: "600",
        color: "#1976d2",
        letterSpacing: "1px"
    },

    pageTitle: {
        margin: "0",
        fontSize: "30px",
        fontWeight: "600",
        color: "#1f2937"
    },

    pageDescription: {
        margin: "8px 0 0 0",
        fontSize: "14px",
        color: "#6b7280"
    },


    /* ===============================
       CURRENT USER
    =============================== */

    currentUser: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 14px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        border: "1px solid #e5e7eb"
    },

    avatar: {
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        backgroundColor: "#1976d2",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "600"
    },

    userRole: {
        margin: "4px 0 0 0",
        fontSize: "12px",
        color: "#6b7280",
        textTransform: "capitalize"
    },


    /* ===============================
       SECTION
    =============================== */

    sectionTitle: {
        margin: "0 0 18px 0",
        fontSize: "20px",
        fontWeight: "600",
        color: "#1f2937"
    },


    /* ===============================
       OVERVIEW CARDS
    =============================== */

    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "18px",
        marginBottom: "30px"
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "22px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
    },

    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px"
    },

    cardIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "9px",
        backgroundColor: "#eef4ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
    },

    cardRoute: {
        fontSize: "10px",
        fontWeight: "600",
        color: "#9ca3af",
        letterSpacing: "0.8px"
    },

    cardNumber: {
        margin: "0",
        fontSize: "30px",
        fontWeight: "700",
        color: "#111827"
    },

    cardName: {
        margin: "7px 0 0 0",
        fontSize: "15px",
        fontWeight: "600",
        color: "#374151"
    },

    cardInfo: {
        margin: "6px 0 0 0",
        fontSize: "12px",
        color: "#9ca3af"
    },


    /* ===============================
       MODULE SECTION
    =============================== */

    moduleSection: {
        marginTop: "30px"
    },

    modules: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "18px"
    },

    moduleCard: {
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "22px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
    },

    moduleIcon: {
        width: "48px",
        height: "48px",
        flexShrink: 0,
        borderRadius: "10px",
        backgroundColor: "#eef4ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px"
    },

    moduleContent: {
        flex: 1
    },

    active: {
        display: "inline-block",
        marginTop: "10px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#15803d"
    },

    planned: {
        display: "inline-block",
        marginTop: "10px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#b45309"
    },


    /* ===============================
       RECENT EMPLOYEES
    =============================== */

  recentCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    marginBottom: "30px"
},

recentTableWrapper: {
    width: "100%",
    overflowX: "auto"
},

recentTable: {
    width: "100%",
    minWidth: "750px",
    borderCollapse: "collapse",
    backgroundColor: "#ffffff"
},

recentTableHeader: {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e5e7eb"
},

recentTableHeaderCell: {
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    whiteSpace: "nowrap"
},

recentTableRow: {
    borderBottom: "1px solid #f1f5f9"
},

recentTableCell: {
    padding: "15px 20px",
    fontSize: "14px",
    color: "#475569",
    whiteSpace: "nowrap"
},

employeeName: {
    fontWeight: "600",
    color: "#1f2937"
},

employeeId: {
    fontSize: "13px",
    color: "#64748b",
    fontFamily: "monospace"
},

departmentBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "6px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "500"
},

statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
}
}