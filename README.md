# TVET Internship Management System

A modern, premium web application for managing student internships at TVET institutions. Developed for **Apeki Tumba TSS**.

🔗 **Repository:** [https://github.com/theodevrwanda/Apeki-Tumba-internship-management-system](https://github.com/theodevrwanda/Apeki-Tumba-internship-management-system)

## ✨ Features

- **Students Management**: Register and manage students (ID, Name, Email, Level).
- **Companies Management**: Track partner organizations and host supervisors.
- **Internship Tracking**: 
  - Assign students to companies (1:1 relationship).
  - Track status: `Not Started`, `Ongoing`, `Completed`.
- **Advanced Reporting**: Generate professional PDF reports of internship assignments.
- **Modern UI**: Dark-themed, responsive dashboard with glassmorphism and smooth animations.
- **Global Dialogs**: Perfectly centered, premium-feel modals for all management actions.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Lucide Icons, jsPDF.
- **Backend**: Node.js, Express.
- **Database**: MySQL.
- **Styling**: Vanilla CSS with modern variables and animations.

---

## 🛠️ API Documentation (Backend)

The server runs by default on `http://localhost:30000/api`

### 🎓 Students
- `GET /api/students` - List all students.
- `POST /api/students` - Register a new student.
- `PUT /api/students/:id` - Update student details.
- `DELETE /api/students/:id` - Remove a student.

### 🏢 Companies
- `GET /api/companies` - List all companies.
- `POST /api/companies` - Register a new host organization.
- `PUT /api/companies/:id` - Update company details.
- `DELETE /api/companies/:id` - Remove a company.

### 💼 Internships
- `GET /api/internships` - Get all assignments with student/company names.
- `POST /api/internships` - Assign a student to a company (Checks for existing assignments).
- `PUT /api/internships/:id` - Update status or dates.
- `DELETE /api/internships/:id` - Cancel an assignment.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server

### 1. Clone the Repository
```bash
git clone https://github.com/theodevrwanda/Apeki-Tumba-internship-management-system.git
cd Apeki-Tumba-internship-management-system
```

### 2. Database Setup
- Create a MySQL database (e.g., `sql8818175`).
- Import the schema from `Server/database/init.sql`.

### 3. Server Configuration
Go to the `Server` folder and create a `.env` file:
```bash
cd Server
# Add these variables to your .env
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=sql8818175
PORT=30000
```
Install dependencies and start:
```bash
npm install
npm run start
```

### 4. Client Configuration
Open a new terminal, go to the `Client` folder:
```bash
cd Client
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 📜 Business Rules
1. **Relationship**: One student can only have **one** active internship assignment at a time.
2. **Companies**: One company can host **many** students.
3. **Status**: Assignments must strictly follow the progress from `Not Started` to `Completed`.

## 📄 License
Internal use for Apeki Tumba TVET institution.
