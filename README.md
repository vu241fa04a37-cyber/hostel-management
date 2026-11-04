# 🏨 Elite Hostel Management System (Pro PMS)

An advanced, comprehensive, and enterprise-grade **Hostel & PG Management SaaS Platform** built with **React**, **Vite**, **Tailwind CSS**, and a **Zero-Setup Local High-Speed Persistent Database Engine** (Node.js & Express).

---

## 🚀 Key Highlights

- **⚡ Zero Cloud Setup**: Completely free of external MongoDB Atlas cloud accounts, connection strings, network timeouts, or credentials.
- **💾 Local Persistent Database**: Automatically reads, writes, and backs up data to `server/data/hostel_database.json` with instant atomic writes.
- **🌐 Offline-Ready & Dual Mode**: Works seamlessly in the browser via `localStorage` as well as full-stack via Express REST API.
- **📄 Printable Formal Documents**: Instant generation and printing of **Official Tax Invoices / Receipts** and **Digital Resident ID Badges** with QR simulations.

---

## 🔑 Login Credentials (Admin & User)

The application features role-based access control with a dedicated **Admin Portal** and **Resident / User Portal**, complete with **1-Click Instant Demo Login**:

| Role | Email / Username | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **👑 Admin (Chief Warden)** | `admin@hostel.com` or `admin` | `admin123` | Full administrative control: Manage rooms, beds, resident directory, issue fee invoices, assign maintenance staff, edit weekly mess menu, approve gate passes, view visitor logs, and export database. |
| **👑 Admin (Assistant Warden)** | `warden@hostel.com` or `warden` | `warden123` | Residential warden operations, attendance, discipline, and maintenance management. |
| **👨‍🎓 Resident / User (Aarav)** | `aarav.sharma@gmail.com` or `aarav` | `student123` | Resident personal hub: View Room 101 & roommates, pay personal fees, print tax receipts, report room maintenance issues, view mess menu, and request overnight leaves. |
| **👨‍🎓 Resident / User (Vikram)** | `vikram.roy@business.edu` or `vikram` | `student123` | Resident personal hub (Deluxe Single Room 102). |
| **👩‍🎓 Resident / User (Priya)** | `priya.iyer@med.edu` or `priya` | `student123` | Resident personal hub (Room 201). |

*(Note: Any registered resident in the student directory can also log in using their email or registration number with default password `student123`!)*

---

## 🌟 8 Advanced Enterprise Modules

1. **📊 Operations Command Center (Dashboard)**:
   - Real-time bed occupancy KPI gauge, vacant bed count & percentage.
   - Financial ledger summary (Collected vs Pending vs Overdue dues).
   - Floor-by-floor occupancy progress and wing breakdown.
   - Maintenance priority alert queue and today's mess highlights.

2. **🛏️ Rooms & Bed Allocation Matrix**:
   - Visual floor map (Floor 1, 2, 3) with interactive bed slots (`101-A`, `101-B`, etc.).
   - Track room amenities (AC, Attached Washroom, High-Speed Wi-Fi, Balcony, Geyser).
   - 1-click room cleanliness toggle (`Clean` vs `Needs Cleaning` vs `Under Repair`).
   - Dynamic room filter by Block, Floor, Type, and Vacancy.

3. **👨‍🎓 Resident Student Hub & Digital ID Badges**:
   - Complete resident directory with registration numbers, room/bed assignment, and course.
   - **Digital Resident ID Card Generator**: View and print student passes with simulated QR code and emergency contact.
   - **Resident Dossier**: Deep-dive profile showing guardian information, verified ID proofs, fee payment ledger, and maintenance history.
   - Direct 1-click WhatsApp shortcut to notify residents or parents.

4. **💳 Invoicing, Billing & Financial Ledger**:
   - Multi-category billing (Hostel Rent, Mess Charges, Caution Deposit, Utility).
   - Track payment modes (UPI, Cash, Bank Transfer, Cards) with transaction references.
   - **Printable Formal Receipt**: Itemized tax receipt layout with verification stamp, chief warden signature line, and browser print trigger.

5. **🛠️ Maintenance Helpdesk & Work Orders**:
   - Ticketing system with ticket numbers (`TKT-301`), priority levels (🔴 Urgent, 🟠 High, 🟡 Medium, 🟢 Low), and categories (Electrical, Plumbing, Wi-Fi, Carpentry).
   - Staff assignment tracking (Electrician, Plumber, IT Admin).
   - Ticket lifecycle progression (`Open` ➔ `In Progress` ➔ `Resolved`).

6. **🍽️ Weekly Mess & Meal Planner**:
   - 7-Day interactive meal schedule (Monday through Sunday) for Breakfast, Lunch, Evening Snacks, and Dinner.
   - In-app meal menu editor for dietary preferences and festive meals.

7. **🚪 Security, Visitors Log & Gate Passes**:
   - **Visitor Register**: Track campus visitors, in/out time, purpose, resident visited, and 1-click checkout.
   - **Digital Gate Pass**: Curfew and overnight leave approval with parent consent verification.

8. **📢 Digital Bulletin Board & Notices**:
   - Urgent announcements, maintenance notices, and pinned directives from the Warden.

---

## 📁 Clean Project Structure

```
hostel-mangement/
├── index.html              # HTML entry point with Plus Jakarta Sans & Tailwind
├── package.json            # React, Vite, Express, Lucide-React
├── vite.config.js          # Vite development server configuration
├── server/
│   ├── server.js           # REST API routes (Rooms, Students, Fees, Complaints, etc.)
│   ├── storage.js          # Zero-config atomic JSON persistent engine
│   └── data/
│       └── hostel_database.json # Automatically persisted local database
└── src/
    ├── main.jsx            # React root renderer
    ├── App.jsx             # Comprehensive, modular Hostel PMS Application
    ├── mockData.js         # Enterprise demo dataset
    └── index.css           # Styling, custom scrollbars, print stylesheets
```

---

## 💻 How to Run

### Option 1: Full-Stack (Server + UI) - Recommended
Run both the local persistent backend API engine and Vite frontend:
```bash
npm start
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Option 2: Frontend Only
```bash
npm run dev
```
Open `http://localhost:3000` in your browser. All changes will be saved to your browser's persistent storage.
