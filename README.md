# MARG — Mentorship & Academic Relationship Gateway

> **Web Technology Lab (WTL) — Mid Sem Evaluation Task (AT-1)**  
> **Student Name:** Sarthak Solanke  
> **Roll No:** 05  
> **Class:** TY (Sem 5)  

---

## 📌 Project Overview

**MARG (Mentorship & Academic Relationship Gateway)** is a full-stack mentor-mentee management portal built for academic institutions. It enables departments to maintain faculty mentor records, track mentee allocations, monitor maximum student capacity limits in real time, and assign students with full duplicate prevention and validation.

---

## ✨ Key Features

- **Faculty Mentor Management:** Add, edit, search, filter, and delete faculty mentors with Employee ID, Department, Designation, and Max Student Capacity limits.
- **Student Mentee Assignment & Allocation:** View assigned student rosters per mentor, track live seat allocation percentages, and add/remove students with duplicate roll number checks.
- **Live Dynamic Metrics:** Top stat counters tracking registered mentors, allocated students, and total mentoring capacity.
- **Search & Filter:** Instant multi-column search (by name, employee ID, department, designation) and department-level filtering.
- **Clean Flat UI:** Minimalist, accessible design with zero unnecessary gradients, clean typography (Inter font), and dark/light mode toggle.
- **Dual Mode (PHP Backend + Offline LocalStorage Fallback):** Connects to a RESTful PHP/MySQL API when hosted on a server, with automatic seamless fallback to `localStorage` when deployed statically or opened locally.
- **Deployable on Vercel:** Configured with `vercel.json` for one-click static hosting.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3 (Custom Flat Design System), Vanilla JavaScript (ES6+) |
| **Backend API** | PHP (RESTful endpoints, PDO with SQL injection protection) |
| **Database** | MySQL / MariaDB (Foreign key cascading constraints) |
| **Deployment** | Vercel (Static Web App), Apache / XAMPP (Full Stack) |

---

## 📂 Project Structure

```
├── index.html        # Main portal interface & modal dialogs
├── style.css         # Modern flat design system & dark mode styles
├── script.js         # Frontend controller, REST API integration & offline fallback
├── api.php           # REST API endpoints (CRUD operations for mentors & mentees)
├── db.php            # PDO Database connection & auto-table initialiser
├── schema.sql        # MySQL database schema & sample seed data
├── vercel.json       # Vercel deployment configuration
└── README.md         # Project documentation & setup instructions
```

---

## 🚀 How to Run Locally

### Option 1: Instant Browser / Live Server (No PHP Needed)
1. Double-click `index.html` to open in any web browser, OR
2. In VS Code, right-click `index.html` and click **"Open with Live Server"**.
*The application will automatically use browser storage for all CRUD and capacity features.*

### Option 2: Full-Stack with XAMPP (PHP + MySQL)
1. Copy the project folder into `C:\xampp\htdocs\mentor-system\`
2. Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
3. Open your browser and navigate to:
   - **App:** `http://localhost/mentor-system/index.html`
   - **API:** `http://localhost/mentor-system/api.php?action=get_mentors`
*(The `db.php` script will automatically create the `mentor_mentee_db` database and tables upon first request).*

---

## 🌐 Deploying to Vercel

1. Push the repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/) and click **"Add New Project"**.
3. Import this GitHub repository (`Roll-no-5---Sarthak-Solanke-TY-AT1-`).
4. Click **Deploy**. Vercel will automatically detect `index.html` and `vercel.json` and deploy the application instantly.

---

## 📄 License
This project is developed for academic evaluation purposes.
