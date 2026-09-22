# Employee Operations Management System

A full-stack web application designed to centralize common employee-related operations such as employee management, attendance, leave management, internal announcements, and operational reporting.

The project was developed to strengthen practical understanding of **React, Node.js, Express.js, REST APIs, MySQL, JWT authentication, role-based authorization, and Redux Toolkit**.

---

## Project Overview

The Employee Operations Management System provides a centralized platform for managing common day-to-day employee operations.

The application follows a full-stack architecture:

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Authentication:** JWT
- **State Management:** Redux Toolkit
- **API Communication:** Axios
- **Version Control:** Git & GitHub

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Role-based authorization
- Secure password handling
- Logout functionality

### Dashboard

- Centralized administrative dashboard
- Overview of employee operations
- Navigation to major system modules

### Employee Management

- View employees
- Add employees
- Edit employee information
- Delete employees
- Employee pagination
- Employee status management
- Department and role information

### Attendance Management

- Record employee attendance
- View attendance records
- Edit attendance records
- Delete attendance records
- Attendance status:
  - Present
  - Absent
  - Late
  - Half Day
- Prevent duplicate attendance records for the same employee and date

### Leave Management

- Create leave requests
- View leave records
- Edit pending leave requests
- Delete pending leave requests
- Approve leave requests
- Reject leave requests
- Leave types:
  - Casual Leave
  - Sick Leave
  - Earned Leave
  - Other

### Announcements

- Create announcements
- View announcements
- Edit announcements
- Delete announcements
- Pagination
- Announcement management through Redux Toolkit

### Reports

The Reports module provides a centralized operational summary including:

- Total employees
- Active employees
- Attendance summary
- Leave summary
- Recent announcements

---

## User Roles

The application supports role-based access control.

### Super Admin

The Super Admin can access administrative modules such as:

- Dashboard
- Employee Management
- Attendance Management
- Leave Management
- Announcements
- Reports

### Employee/User

Authenticated employees have access according to their assigned role and protected routes.

---

## Technology Stack

### Frontend

- React.js
- React Router
- Redux Toolkit
- Axios
- CSS
- Vite

### Backend

- Node.js
- Express.js
- JWT
- bcrypt
- REST APIs

### Database

- MySQL
- Foreign key relationships
- SQL queries

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman

---

## Project Structure

```text
Employee-Operations/
│
├── login-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── middleware/
│   ├── routes/
│   ├── package.json
│   ├── server.js
│   └── ...
│
├── .gitignore
└── README.md
```

---

## Authentication & Authorization

The application uses JWT-based authentication.

The authentication flow is:

```text
Login
  ↓
Backend validates credentials
  ↓
JWT token generated
  ↓
Token stored by frontend
  ↓
Axios sends Bearer token
  ↓
Authentication middleware verifies token
  ↓
Role middleware checks permissions
  ↓
Protected resource
```

Authentication determines **who the user is**, while authorization determines **what the user is allowed to access**.

---

## Database Relationships

Employee-related operational data is connected through the employee/user ID.

For example:

```text
Users
  │
  ├── Attendance
  │
  └── Leaves
```

This allows attendance and leave records to be associated with individual employees.

---

## API

The backend provides REST API endpoints for the major application modules.

Examples include:

```text
POST   /register
POST   /login

GET    /users

GET    /attendance
POST   /attendance
PUT    /attendance/:id
DELETE /attendance/:id

GET    /leaves
POST   /leaves
PUT    /leaves/:id
DELETE /leaves/:id
PUT    /leaves/:id/status

GET    /reports/summary
```

The exact API implementation is available in the `backend` directory.

---

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Vishnumandalapython/employee-operations-management-system.git
```

### 2. Open the project

```bash
cd employee-operations-management-system
```

### 3. Install frontend dependencies

```bash
cd login-frontend
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

### 5. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 6. Configure backend environment variables

Create a `.env` file inside the `backend` directory.

Example:

```env
DB_HOST=localhost
