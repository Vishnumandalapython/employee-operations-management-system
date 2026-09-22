import { useEffect, useState } from "react";
import api from "../api/api";
import "./Users.css";

function Users() {

    // READ
    const [users, setUsers] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    // Loading / message
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // CREATE
    const [fullName, setFullName] = useState("");
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");

    // UPDATE
    const [editId, setEditId] = useState(null);
    const [editFullName, setEditFullName] = useState("");
    const [editUserid, setEditUserid] = useState("");
    const [editPassword, setEditPassword] = useState("");
const [email, setEmail] = useState("");
const [department, setDepartment] = useState("");
const [status, setStatus] = useState("Active");

const [editEmail, setEditEmail] = useState("");
const [editDepartment, setEditDepartment] = useState("");
const [editStatus, setEditStatus] = useState("Active");

// GET USERS
const getUsers = async () => {

    try {

        setLoading(true);

        console.log("GET USERS: Request started");

        const response = await api.get("/users");

        console.log("GET USERS: Full response:", response);
        console.log("GET USERS: Response data:", response.data);

        setUsers(response.data);

    } catch (error) {

        console.log("GET USERS ERROR:", error);

        console.log(
            "ERROR RESPONSE:",
            error.response
        );

        console.log(
            "ERROR STATUS:",
            error.response?.status
        );

        console.log(
            "ERROR DATA:",
            error.response?.data
        );

        setMessage(
            error.response?.data?.message ||
            "Failed to load users"
        );

    } finally {

        setLoading(false);

    }
};


    // RUN WHEN PAGE LOADS
    useEffect(() => {

        getUsers();

    }, []);


    // CREATE USER
const handleCreateUser = async () => {

    if (
        !fullName ||
        !userid ||
        !password ||
        !email ||
        !department ||
        !status
    ) {
        setMessage("All fields are required");
        return;
    }

    try {

        const response = await api.post("/users", {
            fullName,
            userid,
            password,
            email,
            department,
            status
        });

        setMessage(response.data.message);

        setFullName("");
        setUserid("");
        setPassword("");
        setEmail("");
        setDepartment("");
        setStatus("Active");

        setCurrentPage(1);

        await getUsers();

    } catch (error) {

        console.log(error);

        setMessage(
            error.response?.data?.message ||
            "Failed to create user"
        );

    }
};
const handleEdit = (user) => {

    setEditId(user.id);

    setEditFullName(user.fullName);
    setEditUserid(user.userid);

    setEditEmail(user.email || "");
    setEditDepartment(user.department || "");
    setEditStatus(user.status || "Active");

    // Don't load the existing password
    setEditPassword("");
};

    // UPDATE USER
   const handleUpdate = async () => {

    if (
        !editFullName ||
        !editUserid ||
        !editEmail ||
        !editDepartment ||
        !editStatus
    ) {
        setMessage("Please fill all required fields");
        return;
    }

    try {

        const response = await api.put(
            `/users/${editId}`,
            {
                fullName: editFullName,
                userid: editUserid,
                password: editPassword,
                email: editEmail,
                department: editDepartment,
                status: editStatus
            }
        );

        setMessage(response.data.message);

        setEditId(null);

        setEditPassword("");

        await getUsers();

    } catch (error) {

        console.log(error);

        setMessage(
            error.response?.data?.message ||
            "Failed to update user"
        );

    }
};

    // DELETE USER
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await api.delete(`/users/${id}`);

            setMessage(response.data.message);

            await getUsers();

            // Calculate pages after deletion
            const remainingUsers = users.length - 1;
            const totalPages = Math.ceil(
                remainingUsers / usersPerPage
            );

            if (currentPage > totalPages && totalPages > 0) {
                setCurrentPage(totalPages);
            }

        } catch (error) {

            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to delete user"
            );

        }
    };


    // -----------------------------
    // PAGINATION
    // -----------------------------

    const totalPages = Math.ceil(
        users.length / usersPerPage
    );

    const indexOfLastUser =
        currentPage * usersPerPage;

    const indexOfFirstUser =
        indexOfLastUser - usersPerPage;

    const currentUsers = users.slice(
        indexOfFirstUser,
        indexOfLastUser
    );


    // Change page
    const handlePageChange = (pageNumber) => {

        setCurrentPage(pageNumber);

    };


    // Previous page
    const handlePrevious = () => {

        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }

    };


    // Next page
    const handleNext = () => {

        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }

    };


    // LOADING
    if (loading) {

        return <h2>Loading...</h2>;

    }


    return (

        <div className="users-page">

            <h1 className="users-title">
                Employee Management
            </h1>


            {/* ADD USER */}

            <div className="user-form-card">

                <h2>Add Employee</h2>

                <div className="user-form">

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        placeholder="User ID"
                        value={userid}
                        onChange={(e) =>
                            setUserid(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />
<input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
/>

<input
    type="text"
    placeholder="Department"
    value={department}
    onChange={(e) => setDepartment(e.target.value)}
/>

<select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
>
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
</select>
                    <button
                        className="add-user-btn"
                        onClick={handleCreateUser}
                    >
                        Add User
                    </button>

                </div>

                {message && (
                    <p className="user-message">
                        {message}
                    </p>
                )}

            </div>


            {/* EDIT USER */}

            {editId && (

                <div className="user-form-card edit-card">

                    <h2>Edit User</h2>

                    <div className="user-form">

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={editFullName}
                            onChange={(e) =>
                                setEditFullName(e.target.value)
                            }
                        />

                   
<input
    type="text"
    placeholder="User ID"
    value={editUserid}
    onChange={(e) => setEditUserid(e.target.value)}
/>

<input
    type="email"
    placeholder="Email"
    value={editEmail}
    onChange={(e) => setEditEmail(e.target.value)}
/>

<input
    type="text"
    placeholder="Department"
    value={editDepartment}
    onChange={(e) => setEditDepartment(e.target.value)}
/>

<select
    value={editStatus}
    onChange={(e) => setEditStatus(e.target.value)}
>
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
</select>

<input
    type="password"
    placeholder="New Password (optional)"
    value={editPassword}
    onChange={(e) => setEditPassword(e.target.value)}
/>

                        <div className="edit-buttons">

                            <button
                                className="update-btn"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>

                            <button
                                className="cancel-btn"
                                onClick={() => setEditId(null)}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* USER TABLE */}

            <div className="user-table-card">

                <div className="table-header">

                    <h2>employee List</h2>

                    <span className="user-count">
                        {users.length} Users
                    </span>

                </div>


                <div className="table-wrapper">

                    <table className="users-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Full Name </th>
                                <th>employee_id</th>
                                     <th>Role</th>
                                      <th>Email</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>

                        </thead>


<tbody>

    {currentUsers.length > 0 ? (

        currentUsers.map((user) => (

            <tr key={user.id}>

                <td>
                    {user.id}
                </td>

                <td>
                    {user.fullName}
                </td>

                <td>
                    {user.userid}
                </td>

                <td>
                    {user.role}
                </td>

                <td>
                    {user.email}
                </td>

                <td>
                    {user.department}
                </td>

                <td>
                    {user.status}
                </td>

                <td>

                    <button
                        className="edit-btn"
                        onClick={() => handleEdit(user)}
                    >
                        Edit
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                    >
                        Delete
                    </button>

                </td>

            </tr>

        ))

    ) : (

        <tr>

            <td colSpan="8">
                No Employees found
            </td>

        </tr>

    )}

</tbody>

                    </table>

                </div>


                {/* PAGINATION */}

                {totalPages > 1 && (

                    <div className="pagination">

                        <button
                            className="pagination-btn"
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>


                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((pageNumber) => (

                            <button
                                key={pageNumber}
                                className={
                                    currentPage === pageNumber
                                        ? "pagination-btn active"
                                        : "pagination-btn"
                                }
                                onClick={() =>
                                    handlePageChange(pageNumber)
                                }
                            >
                                {pageNumber}
                            </button>

                        ))}


                        <button
                            className="pagination-btn"
                            onClick={handleNext}
                            disabled={
                                currentPage === totalPages
                            }
                        >
                            Next
                        </button>

                    </div>

                )}

           </div>

        </div> 

    );

}

export default Users;