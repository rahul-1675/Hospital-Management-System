# 🏥 Hospital Management System (HMS) - Full-Stack Application

A modern, comprehensive full-stack Hospital Management System built with a **React 19 + Vite** frontend and a modular **Node.js + Express** REST API backend.

---

## 📁 Repository Structure

```
HMS/
├── frontend/                     # React 19 + Vite Frontend
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── app/                  # App container & router definitions
│   │   ├── assets/               # Branding, illustrations, videos
│   │   ├── components/           # Role-based UI components (Admin, Doctor, Pharmacy, Reception, Staff)
│   │   ├── context/              # Context state providers integrated with backend API
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layouts/              # Dashboard and shell layouts
│   │   ├── pages/                # Page views for each hospital portal
│   │   ├── services/             # Backend API clients & connector services
│   │   └── styles/               # CSS styles & design tokens
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js            # Vite config with API proxy to port 5001
│   └── .env                      # Frontend environment variables
│
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/          # Business logic handlers
│   │   ├── routes/               # Modular Express API routers
│   │   ├── data/                 # JSON file store & seed dataset
│   │   └── server.js             # Express server entry point (Port 5001)
│   ├── package.json
│   └── .env                      # Backend environment variables
│
├── package.json                  # Root orchestration scripts
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies
Run the command below from the root directory to install dependencies for root, frontend, and backend:

```bash
npm run install:all
```

### 2. Start Both Frontend & Backend (Concurrently)
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001/api](http://localhost:5001/api)
- **API Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs both backend and frontend concurrently in development mode |
| `npm run dev:frontend` | Starts only the Vite frontend dev server on port `5173` |
| `npm run dev:backend` | Starts only the Express backend server on port `5001` with nodemon |
| `npm run install:all` | Installs dependencies across root, frontend, and backend |
| `npm run build` | Builds the production bundle of the frontend application |
| `npm run start` | Starts the production Node.js backend server |

---

## 🔑 Demo Credentials

| Role | Portal ID | Password | Access / Functionality |
| :--- | :--- | :--- | :--- |
| **Admin** | `ADM001` | `admin@123` | User management, audit logs, billing & finance, system metrics |
| **Doctor** | `DOC001` | `doc@123` | Patient queue, appointments, consultations, e-prescriptions |
| **Receptionist** | `REC001` | `rec@123` | Patient check-ins, token queues, appointment scheduling, invoices |
| **Pharmacy** | `PHA001` | `pha@123` | Medicine inventory, stock alerts, prescription dispensing, orders |
| **Staff** | `STF001` | `stf@123` | Task management, duty status, shift schedule & swap requests |

---

## 🌐 REST API Endpoints Overview

### Auth & System
- `GET /api/health` - API health and status check
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User session logout
- `GET /api/auth/profile/:role` - Fetch role profile

### Admin Module
- `GET /api/admin/users` - List all staff & medical users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/status` - Suspend or activate user
- `GET /api/admin/logs` - Audit logs
- `GET /api/admin/invoices` - Invoices and financial records
- `PATCH /api/admin/invoices/:id/pay` - Mark invoice as paid
- `PATCH /api/admin/invoices/:id/refund` - Process invoice refund

### Doctor Module
- `GET /api/doctor/appointments` - Doctor's appointments
- `GET /api/doctor/queue/:doctorName` - Doctor's patient queue
- `POST /api/doctor/prescriptions` - Submit prescription

### Reception Module
- `GET /api/reception/appointments` - All appointments
- `POST /api/reception/appointments` - Book appointment
- `PUT /api/reception/appointments/:id` - Reschedule / update appointment
- `DELETE /api/reception/appointments/:id` - Cancel appointment
- `GET /api/reception/queue` - Live central queue status
- `PUT /api/reception/queue` - Update queue state & token assignments
- `GET /api/reception/invoices` - Reception invoices
- `POST /api/reception/invoices` - Generate patient invoice

### Pharmacy Module
- `GET /api/pharmacy/inventory` - Medicine stock inventory
- `POST /api/pharmacy/inventory` - Add new medicine
- `PUT /api/pharmacy/inventory/:id` - Update stock/pricing
- `DELETE /api/pharmacy/inventory/:id` - Remove medicine
- `GET /api/pharmacy/prescriptions` - Incoming prescriptions
- `PATCH /api/pharmacy/prescriptions/:id/dispense` - Dispense medication

### Staff Module
- `GET /api/staff/members` - Staff roster
- `PATCH /api/staff/members/:id/status` - Toggle on/off duty status
- `GET /api/staff/tasks` - Operational tasks list
- `POST /api/staff/tasks` - Create task
- `PATCH /api/staff/tasks/:id/status` - Update task progress (`ACTIVE`, `PAUSED`, `COMPLETED`)

### Feedback Module
- `GET /api/feedback` - Patient feedback & reviews
- `POST /api/feedback` - Submit new feedback
