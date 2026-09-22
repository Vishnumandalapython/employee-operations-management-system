require("dotenv").config();
console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roleMiddleware = require("./middleware/roleMiddleware");
const jwtSecret = process.env.JWT_SECRET;
const app = express();
const authMiddleware =
    require("./middleware/authMiddleware");
const PORT = 5000;

// CORS
app.use(cors({
    origin: "http://localhost:5173"
}));

// Read JSON data from React
app.use(express.json());


// HOME API
app.get("/", (req, res) => {
    res.send("Server is Running...");
});


// ===============================
// GET USERS
// ===============================

app.get("/users", authMiddleware, (req, res) => {

    const query = `
        SELECT
            id,
            fullName,
            userid,
            role,
            email,
            department,
            status,
            created_at
        FROM users
    `;

    db.query(query, (err, result) => {

        if (err) {

            console.log("========== USERS DATABASE ERROR ==========");
            console.log(err);
            console.log("==========================================");

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        console.log("========== USERS DATA ==========");
        console.log(result);
        console.log("================================");

        res.json(result);
    });

});

app.post("/users", async (req, res) => {

    const {
        fullName,
        userid,
        password,
        email,
        department,
        status
    } = req.body;

    // 1. Validate required fields
    if (
        !fullName ||
        !userid ||
        !password ||
        !email ||
        !department ||
        !status
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {

        // 2. Check whether userid already exists
        const checkQuery =
            "SELECT * FROM users WHERE userid = ?";

        db.query(
            checkQuery,
            [userid],
            async (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }

                // 3. Duplicate userid
                if (result.length > 0) {

                    return res.status(409).json({
                        success: false,
                        message: "User ID already exists"
                    });

                }

                // 4. Hash password
                const hashedPassword =
                    await bcrypt.hash(password, 10);

                // 5. Insert user
                const insertQuery = `
                    INSERT INTO users
                    (
                        fullName,
                        userid,
                        password,
                        role,
                        email,
                        department,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    insertQuery,
                    [
                        fullName,
                        userid,
                        hashedPassword,
                        "user",
                        email,
                        department,
                        status
                    ],
                    (err, result) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                success: false,
                                message: "Failed to create user"
                            });

                        }

                        return res.status(201).json({
                            success: true,
                            message: "User created successfully"
                        });

                    }
                );

            }
        );

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

// ===============================
// LOGIN API
// ===============================

app.post("/login", async (req, res) => {

    const { userid, password } = req.body;

    if (!userid || !password) {
        return res.status(400).json({
            success: false,
            message: "User ID and Password are required"
        });
    }

    const loginQuery =
        "SELECT * FROM users WHERE userid = ?";

    db.query(
        loginQuery,
        [userid],
        async (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid User ID or Password"
                });
            }

            const user = result[0];

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid User ID or Password"
                });
            }

            // JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    userid: user.userid,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );

            res.json({
                success: true,
                message: "Login successful",

                token,

                user: {
                    id: user.id,
                    fullName: user.fullName,
                    userid: user.userid,
                    role: user.role
                }
            });
        }
    );
});
// ===============================
// REGISTER API
// ===============================



app.post("/register", async (req, res) => {

    const { fullName, userid, password } = req.body;

    // 1. Validate
    if (!fullName || !userid || !password) {
        return res.status(400).json({
            success: false,
            message: "Full Name, User ID and Password are required"
        });
    }

    // 2. Check whether userid already exists
    const checkQuery =
        "SELECT * FROM users WHERE userid = ?";

    db.query(checkQuery, [userid], async (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        // 3. Duplicate userid
        if (result.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User ID already exists"
            });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Insert user
        const insertQuery = `
            INSERT INTO users
            (fullName, userid, password, role)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            insertQuery,
            [fullName, userid, hashedPassword, "user"],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Registration failed"
                    });
                }

                // 6. Send response
                res.status(201).json({
                    success: true,
                    message: "Registration successful"
                });
            }
        );

    });

});
app.put("/users/:id", async (req, res) => {

    const { id } = req.params;

    const {
        fullName,
        userid,
        password,
        email,
        department,
        status
    } = req.body;

    // Validate required fields
    if (
        !fullName ||
        !userid ||
        !email ||
        !department ||
        !status
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {

        // Check whether another user already has this userid
        const checkQuery = `
            SELECT id
            FROM users
            WHERE userid = ?
            AND id != ?
        `;

        db.query(
            checkQuery,
            [userid, id],
            async (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }

                // Duplicate userid
                if (result.length > 0) {

                    return res.status(409).json({
                        success: false,
                        message: "User ID already exists"
                    });

                }

                // If password is provided, hash it
                if (password) {

                    const hashedPassword =
                        await bcrypt.hash(password, 10);

                    const updateQuery = `
                        UPDATE users
                        SET
                            fullName = ?,
                            userid = ?,
                            password = ?,
                            email = ?,
                            department = ?,
                            status = ?
                        WHERE id = ?
                    `;

                    db.query(
                        updateQuery,
                        [
                            fullName,
                            userid,
                            hashedPassword,
                            email,
                            department,
                            status,
                            id
                        ],
                        (err, result) => {

                            if (err) {

                                console.log(err);

                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to update user"
                                });

                            }

                            if (result.affectedRows === 0) {

                                return res.status(404).json({
                                    success: false,
                                    message: "User not found"
                                });

                            }

                            return res.json({
                                success: true,
                                message: "User updated successfully"
                            });

                        }
                    );

                } else {

                    // Update without changing password
                    const updateQuery = `
                        UPDATE users
                        SET
                            fullName = ?,
                            userid = ?,
                            email = ?,
                            department = ?,
                            status = ?
                        WHERE id = ?
                    `;

                    db.query(
                        updateQuery,
                        [
                            fullName,
                            userid,
                            email,
                            department,
                            status,
                            id
                        ],
                        (err, result) => {

                            if (err) {

                                console.log(err);

                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to update user"
                                });

                            }

                            if (result.affectedRows === 0) {

                                return res.status(404).json({
                                    success: false,
                                    message: "User not found"
                                });

                            }

                            return res.json({
                                success: true,
                                message: "User updated successfully"
                            });

                        }
                    );

                }

            }
        );

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});
// ===============================
// START SERVER
// ===============================
// ===============================
// POSTS API
// ===============================

app.get("/posts", (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    const countQuery = "SELECT COUNT(*) AS total FROM posts";

    db.query(countQuery, (err, countResult) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to count posts"
            });
        }

        const totalPosts = countResult[0].total;

        const totalPages = Math.ceil(
            totalPosts / limit
        );

        const postsQuery = `
            SELECT *
            FROM posts
            ORDER BY id DESC
            LIMIT ? OFFSET ?
        `;

        db.query(
            postsQuery,
            [limit, offset],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Failed to fetch posts"
                    });
                }

                res.json({
                    success: true,
                    posts: result,
                    currentPage: page,
                    totalPages: totalPages,
                    totalPosts: totalPosts
                });

            }
        );

    });

});
// CREATE POST
app.post("/posts", (req, res) => {

    const { title, body } = req.body;

    if (!title || !body) {

        return res.status(400).json({
            success: false,
            message: "Title and body are required"
        });

    }

    const query = `
        INSERT INTO posts (title, body)
        VALUES (?, ?)
    `;

    db.query(
        query,
        [title, body],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create post"
                });

            }

            res.status(201).json({
                success: true,
                message: "Post created successfully",

                post: {
                    id: result.insertId,
                    title: title,
                    body: body
                }
            });

        }
    );

});
// UPDATE POST
app.put("/posts/:id", (req, res) => {

    const { id } = req.params;
    const { title, body } = req.body;

    if (!title || !body) {

        return res.status(400).json({
            success: false,
            message: "Title and body are required"
        });

    }

    const query = `
        UPDATE posts
        SET title = ?, body = ?
        WHERE id = ?
    `;

    db.query(
        query,
        [title, body, id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update post"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Post not found"
                });

            }

            res.json({
                success: true,
                message: "Post updated successfully",
                post: {
                    id: Number(id),
                    title,
                    body
                }
            });

        }
    );

});

app.delete(
    "/posts/:id",
    authMiddleware,
    roleMiddleware("superadmin"),
    (req, res) => {
        

    const { id } = req.params;

    const query = `
        DELETE FROM posts
        WHERE id = ?
    `;

    db.query(query, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete post"
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }

        res.json({
            success: true,
            message: "Post deleted successfully",
            postId: Number(id)
        });

    });

});
app.get("/profile", authMiddleware, (req, res) => {

    res.json({
        success: true,
        message: "Protected API accessed",
        user: req.user
    });

});
app.post(
    "/attendance",
    authMiddleware,
    roleMiddleware("superadmin"),
    (req, res) => {

        const {
            employee_id,
            attendance_date,
            check_in,
            check_out,
            status
        } = req.body;

        // Validate required fields

        if (
            !employee_id ||
            !attendance_date ||
            !status
        ) {
            return res.status(400).json({
                success: false,
                message: "Employee, date and status are required"
            });
        }


        // Validate attendance status

        const allowedStatuses = [
            "Present",
            "Absent",
            "Late",
            "Half Day"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid attendance status"
            });

        }


        // Check whether attendance already exists

        const checkQuery = `
            SELECT id
            FROM attendance
            WHERE employee_id = ?
            AND attendance_date = ?
        `;

        db.query(
            checkQuery,
            [employee_id, attendance_date],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }


                if (result.length > 0) {

                    return res.status(409).json({
                        success: false,
                        message: "Attendance already exists for this employee on this date"
                    });

                }


                // Insert attendance

                const insertQuery = `
                    INSERT INTO attendance
                    (
                        employee_id,
                        attendance_date,
                        check_in,
                        check_out,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?)
                `;

                db.query(
                    insertQuery,
                    [
                        employee_id,
                        attendance_date,
                        check_in || null,
                        check_out || null,
                        status
                    ],
                    (err, result) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                success: false,
                                message: "Failed to create attendance"
                            });

                        }


                        return res.status(201).json({
                            success: true,
                            message: "Attendance marked successfully",
                            attendanceId: result.insertId
                        });

                    }
                );

            }
        );

    }
);

app.get(
    "/attendance",
    authMiddleware,
    (req, res) => {

        const query = `
            SELECT
                attendance.id,
                attendance.employee_id,
                users.fullName,
                users.userid,
                users.department,
                attendance.attendance_date,
                attendance.check_in,
                attendance.check_out,
                attendance.status,
                attendance.created_at
            FROM attendance
            INNER JOIN users
                ON attendance.employee_id = users.id
            ORDER BY attendance.attendance_date DESC,
                     attendance.id DESC
        `;

        db.query(
            query,
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Failed to fetch attendance"
                    });

                }

                return res.json({
                    success: true,
                    attendance: result
                });

            }
        );

    }
);
app.get(
    "/attendance/:id",
    authMiddleware,
    (req, res) => {

        const { id } = req.params;

        const query = `
            SELECT
                attendance.id,
                attendance.employee_id,
                users.fullName,
                users.userid,
                users.department,
                attendance.attendance_date,
                attendance.check_in,
                attendance.check_out,
                attendance.status,
                attendance.created_at
            FROM attendance
            INNER JOIN users
                ON attendance.employee_id = users.id
            WHERE attendance.id = ?
        `;

        db.query(
            query,
            [id],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }


                if (result.length === 0) {

                    return res.status(404).json({
                        success: false,
                        message: "Attendance record not found"
                    });

                }


                return res.json({
                    success: true,
                    attendance: result[0]
                });

            }
        );

    }
);
app.put(
    "/attendance/:id",
    authMiddleware,
    roleMiddleware("superadmin"),
    (req, res) => {

        const { id } = req.params;

        const {
            employee_id,
            attendance_date,
            check_in,
            check_out,
            status
        } = req.body;


        if (
            !employee_id ||
            !attendance_date ||
            !status
        ) {

            return res.status(400).json({
                success: false,
                message: "Employee, date and status are required"
            });

        }


        const allowedStatuses = [
            "Present",
            "Absent",
            "Late",
            "Half Day"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid attendance status"
            });

        }


        const checkQuery = `
            SELECT id
            FROM attendance
            WHERE employee_id = ?
            AND attendance_date = ?
            AND id != ?
        `;


        db.query(
            checkQuery,
            [employee_id, attendance_date, id],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }


                if (result.length > 0) {

                    return res.status(409).json({
                        success: false,
                        message: "Attendance already exists for this employee on this date"
                    });

                }


                const updateQuery = `
                    UPDATE attendance
                    SET
                        employee_id = ?,
                        attendance_date = ?,
                        check_in = ?,
                        check_out = ?,
                        status = ?
                    WHERE id = ?
                `;


                db.query(
                    updateQuery,
                    [
                        employee_id,
                        attendance_date,
                        check_in || null,
                        check_out || null,
                        status,
                        id
                    ],
                    (err, result) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                success: false,
                                message: "Failed to update attendance"
                            });

                        }


                        if (result.affectedRows === 0) {

                            return res.status(404).json({
                                success: false,
                                message: "Attendance record not found"
                            });

                        }


                        return res.json({
                            success: true,
                            message: "Attendance updated successfully"
                        });

                    }
                );

            }
        );

    }
);
app.delete(
    "/attendance/:id",
    authMiddleware,
    roleMiddleware("superadmin"),
    (req, res) => {

        const { id } = req.params;

        const query = `
            DELETE FROM attendance
            WHERE id = ?
        `;

        db.query(
            query,
            [id],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Failed to delete attendance"
                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        success: false,
                        message: "Attendance record not found"
                    });

                }


                return res.json({
                    success: true,
                    message: "Attendance deleted successfully"
                });

            }
        );

    }
);

// ============================================================
// LEAVE MANAGEMENT APIs
// ============================================================


// ============================================================
// CREATE LEAVE
// POST /leaves
// ============================================================

app.post(
    "/leaves",
    authMiddleware,
    (req, res) => {

        const {
            employee_id,
            leave_type,
            from_date,
            to_date,
            reason
        } = req.body;


        // --------------------------------
        // REQUIRED FIELD VALIDATION
        // --------------------------------

        if (
            !employee_id ||
            !leave_type ||
            !from_date ||
            !to_date
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Employee, leave type, from date and to date are required"
            });

        }


        // --------------------------------
        // DATE VALIDATION
        // --------------------------------

        if (new Date(from_date) > new Date(to_date)) {

            return res.status(400).json({
                success: false,
                message:
                    "From date cannot be after to date"
            });

        }


        // --------------------------------
        // LEAVE TYPE VALIDATION
        // --------------------------------

        const allowedLeaveTypes = [
            "Casual Leave",
            "Sick Leave",
            "Earned Leave",
            "Other"
        ];

        if (!allowedLeaveTypes.includes(leave_type)) {

            return res.status(400).json({
                success: false,
                message: "Invalid leave type"
            });

        }


        // --------------------------------
        // CHECK EMPLOYEE
        // --------------------------------

        const employeeQuery = `
            SELECT id
            FROM users
            WHERE id = ?
        `;

        db.query(
            employeeQuery,
            [employee_id],
            (err, employeeResult) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }


                if (employeeResult.length === 0) {

                    return res.status(404).json({
                        success: false,
                        message: "Employee not found"
                    });

                }


                // --------------------------------
                // INSERT LEAVE
                // --------------------------------

                const insertQuery = `
                    INSERT INTO leaves
                    (
                        employee_id,
                        leave_type,
                        from_date,
                        to_date,
                        reason,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    insertQuery,
                    [
                        employee_id,
                        leave_type,
                        from_date,
                        to_date,
                        reason || null,
                        "Pending"
                    ],
                    (err, result) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Failed to create leave request"
                            });

                        }


                        return res.status(201).json({
                            success: true,
                            message:
                                "Leave request created successfully",
                            leaveId: result.insertId
                        });

                    }
                );

            }
        );

    }
);


// ============================================================
// GET ALL LEAVES
// GET /leaves
// ============================================================

app.get(
    "/leaves",
    authMiddleware,
    (req, res) => {

        const query = `
            SELECT
                leaves.id,
                leaves.employee_id,
                users.fullName,
                users.userid,
                users.department,
                leaves.leave_type,
                leaves.from_date,
                leaves.to_date,
                leaves.reason,
                leaves.status,
                leaves.created_at
            FROM leaves
            INNER JOIN users
                ON leaves.employee_id = users.id
            ORDER BY
                leaves.created_at DESC
        `;


        db.query(
            query,
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message:
                            "Failed to fetch leave requests"
                    });

                }


                return res.json({
                    success: true,
                    leaves: result
                });

            }
        );

    }
);


// ============================================================
// GET SINGLE LEAVE
// GET /leaves/:id
// ============================================================

app.get(
    "/leaves/:id",
    authMiddleware,
    (req, res) => {

        const { id } = req.params;


        const query = `
            SELECT
                leaves.id,
                leaves.employee_id,
                users.fullName,
                users.userid,
                users.department,
                leaves.leave_type,
                leaves.from_date,
                leaves.to_date,
                leaves.reason,
                leaves.status,
                leaves.created_at
            FROM leaves
            INNER JOIN users
                ON leaves.employee_id = users.id
            WHERE leaves.id = ?
        `;


        db.query(
            query,
            [id],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }


                if (result.length === 0) {

                    return res.status(404).json({
                        success: false,
                        message:
                            "Leave request not found"
                    });

                }


                return res.json({
                    success: true,
                    leave: result[0]
                });

            }
        );

    }
);

app.put(
    "/leaves/:id",
    authMiddleware,
    roleMiddleware("superadmin"),
    (req, res) => {

        const { id } = req.params;

        const {
            employee_id,
            leave_type,
            from_date,
            to_date,
            reason
        } = req.body;


        // --------------------------------
        // REQUIRED VALIDATION
        // --------------------------------

        if (
            !employee_id ||
            !leave_type ||
            !from_date ||
            !to_date
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Employee, leave type, from date and to date are required"
            });

        }


        // --------------------------------
        // DATE VALIDATION
        // --------------------------------

        if (new Date(from_date) > new Date(to_date)) {

            return res.status(400).json({
                success: false,
                message:
                    "From date cannot be after to date"
            });

        }


        // --------------------------------
        // LEAVE TYPE VALIDATION
        // --------------------------------

        const allowedLeaveTypes = [
            "Casual Leave",
            "Sick Leave",
            "Earned Leave",
            "Other"
        ];

        if (!allowedLeaveTypes.includes(leave_type)) {

            return res.status(400).json({
                success: false,
                message: "Invalid leave type"
            });

        }


        // --------------------------------
        // CHECK LEAVE EXISTS
        // --------------------------------

        const checkLeaveQuery = `
            SELECT
                id,
                status
            FROM leaves
            WHERE id = ?
        `;


        db.query(
            checkLeaveQuery,
            [id],
            (err, leaveResult) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }


                if (leaveResult.length === 0) {

                    return res.status(404).json({
                        success: false,
                        message:
                            "Leave request not found"
                    });

                }


                // --------------------------------
                // ONLY PENDING CAN BE EDITED
                // --------------------------------

                if (leaveResult[0].status !== "Pending") {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Only pending leave requests can be edited"
                    });

                }


                // --------------------------------
                // CHECK EMPLOYEE EXISTS
                // --------------------------------

                const employeeQuery = `
                    SELECT id
                    FROM users
                    WHERE id = ?
                `;


                db.query(
                    employeeQuery,
                    [employee_id],
                    (err, employeeResult) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                success: false,
                                message: "Database error"
                            });

                        }


                        if (employeeResult.length === 0) {

                            return res.status(404).json({
                                success: false,
                                message:
                                    "Employee not found"
                            });

                        }


                        // --------------------------------
                        // UPDATE
                        // --------------------------------

                        const updateQuery = `
                            UPDATE leaves
                            SET
                                employee_id = ?,
                                leave_type = ?,
                                from_date = ?,
                                to_date = ?,
                                reason = ?
                            WHERE id = ?
                        `;


                        db.query(
                            updateQuery,
                            [
                                employee_id,
                                leave_type,
                                from_date,
                                to_date,
                                reason || null,
                                id
                            ],
                            (err) => {

                                if (err) {

                                    console.log(err);

                                    return res.status(500).json({
                                        success: false,
                                        message:
                                            "Failed to update leave request"
                                    });

                                }


                                return res.json({
                                    success: true,
                                    message:
                                        "Leave request updated successfully"
                                });

                            }
                        );

                    }
                );

            }
        );

    }
);


// ============================================================
// DELETE LEAVE
// DELETE /leaves/:id
// ============================================================

app.delete(
    "/leaves/:id",
    authMiddleware,
    roleMiddleware("superadmin"),
    (req, res) => {

        const { id } = req.params;


        // --------------------------------
        // CHECK LEAVE
        // --------------------------------

        const checkQuery = `
            SELECT
                id,
                status
            FROM leaves
            WHERE id = ?
        `;


        db.query(
            checkQuery,
            [id],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }


                if (result.length === 0) {

                    return res.status(404).json({
                        success: false,
                        message:
                            "Leave request not found"
                    });

                }


                // --------------------------------
                // ONLY PENDING CAN BE DELETED
                // --------------------------------

                if (result[0].status !== "Pending") {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Only pending leave requests can be deleted"
                    });

                }


                // --------------------------------
                // DELETE
                // --------------------------------

                const deleteQuery = `
                    DELETE FROM leaves
                    WHERE id = ?
                `;


                db.query(
                    deleteQuery,
                    [id],
                    (err) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Failed to delete leave request"
                            });

                        }


                        return res.json({
                            success: true,
                            message:
                                "Leave request deleted successfully"
                        });

                    }
                );

            }
        );

    }
);


// ============================================================
// APPROVE / REJECT LEAVE
// PUT /leaves/:id/status
// ============================================================

app.put(
    "/leaves/:id/status",
    authMiddleware,
    roleMiddleware("superadmin"),
    (req, res) => {

        const { id } = req.params;

        const { status } = req.body;


        // --------------------------------
        // STATUS VALIDATION
        // --------------------------------

        const allowedStatuses = [
            "Approved",
            "Rejected"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message:
                    "Status must be Approved or Rejected"
            });

        }


        // --------------------------------
        // CHECK LEAVE
        // --------------------------------

        const checkQuery = `
            SELECT
                id,
                status
            FROM leaves
            WHERE id = ?
        `;


        db.query(
            checkQuery,
            [id],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });

                }


                if (result.length === 0) {

                    return res.status(404).json({
                        success: false,
                        message:
                            "Leave request not found"
                    });

                }


                // --------------------------------
                // ONLY PENDING CAN CHANGE
                // --------------------------------

                if (result[0].status !== "Pending") {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Only pending leave requests can be approved or rejected"
                    });

                }


                // --------------------------------
                // UPDATE STATUS
                // --------------------------------

                const updateQuery = `
                    UPDATE leaves
                    SET status = ?
                    WHERE id = ?
                `;


                db.query(
                    updateQuery,
                    [status, id],
                    (err) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Failed to update leave status"
                            });

                        }


                        return res.json({
                            success: true,
                            message:
                                `Leave request ${status.toLowerCase()} successfully`
                        });

                    }
                );

            }
        );

    }
);

// ============================================
// REPORTS SUMMARY
// ============================================

app.get(
    "/reports/summary",
    authMiddleware,
    roleMiddleware("superadmin"),
    (req, res) => {

        const queries = {

            // -------------------------------
            // EMPLOYEE SUMMARY
            // -------------------------------

            employees: `
                SELECT
                    COUNT(*) AS totalEmployees,
                    SUM(
                        CASE
                            WHEN status = 'Active'
                            THEN 1
                            ELSE 0
                        END
                    ) AS activeEmployees
                FROM users
            `,


            // -------------------------------
            // ATTENDANCE SUMMARY
            // -------------------------------

            attendance: `
                SELECT
                    SUM(
                        CASE
                            WHEN status = 'Present'
                            THEN 1
                            ELSE 0
                        END
                    ) AS present,

                    SUM(
                        CASE
                            WHEN status = 'Absent'
                            THEN 1
                            ELSE 0
                        END
                    ) AS absent,

                    SUM(
                        CASE
                            WHEN status = 'Late'
                            THEN 1
                            ELSE 0
                        END
                    ) AS late,

                    SUM(
                        CASE
                            WHEN status = 'Half Day'
                            THEN 1
                            ELSE 0
                        END
                    ) AS halfDay

                FROM attendance
            `,


            // -------------------------------
            // LEAVE SUMMARY
            // -------------------------------

            leaves: `
                SELECT
                    SUM(
                        CASE
                            WHEN status = 'Pending'
                            THEN 1
                            ELSE 0
                        END
                    ) AS pending,

                    SUM(
                        CASE
                            WHEN status = 'Approved'
                            THEN 1
                            ELSE 0
                        END
                    ) AS approved,

                    SUM(
                        CASE
                            WHEN status = 'Rejected'
                            THEN 1
                            ELSE 0
                        END
                    ) AS rejected

                FROM leaves
            `,


            // -------------------------------
            // RECENT ANNOUNCEMENTS
            // -------------------------------

            announcements: `
                SELECT
                    id,
                    title,
                    body
                FROM posts
                ORDER BY id DESC
                LIMIT 5
            `
        };


        // ====================================
        // RUN EMPLOYEE QUERY
        // ====================================

        db.query(
            queries.employees,
            (employeeError, employeeResult) => {

                if (employeeError) {

                    console.log(
                        "Employee report error:",
                        employeeError
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Failed to fetch employee report"
                    });
                }


                // ====================================
                // RUN ATTENDANCE QUERY
                // ====================================

                db.query(
                    queries.attendance,
                    (attendanceError, attendanceResult) => {

                        if (attendanceError) {

                            console.log(
                                "Attendance report error:",
                                attendanceError
                            );

                            return res.status(500).json({
                                success: false,
                                message: "Failed to fetch attendance report"
                            });
                        }


                        // ====================================
                        // RUN LEAVE QUERY
                        // ====================================

                        db.query(
                            queries.leaves,
                            (leaveError, leaveResult) => {

                                if (leaveError) {

                                    console.log(
                                        "Leave report error:",
                                        leaveError
                                    );

                                    return res.status(500).json({
                                        success: false,
                                        message: "Failed to fetch leave report"
                                    });
                                }


                                // ====================================
                                // RUN ANNOUNCEMENT QUERY
                                // ====================================

                                db.query(
                                    queries.announcements,
                                    (
                                        announcementError,
                                        announcementResult
                                    ) => {

                                        if (announcementError) {

                                            console.log(
                                                "Announcement report error:",
                                                announcementError
                                            );

                                            return res.status(500).json({
                                                success: false,
                                                message:
                                                    "Failed to fetch announcement report"
                                            });
                                        }


                                        // ====================================
                                        // SEND FINAL REPORT
                                        // ====================================

                                        res.json({

                                            success: true,

                                            data: {

                                                employees:
                                                    employeeResult[0],

                                                attendance:
                                                    attendanceResult[0],

                                                leaves:
                                                    leaveResult[0],

                                                announcements:
                                                    announcementResult

                                            }

                                        });

                                    }
                                );

                            }
                        );

                    }
                );

            }
        );

    }
);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});