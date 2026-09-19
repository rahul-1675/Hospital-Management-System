# Fake / Mocked Data Audit Report — HMS-Rahul

**Audit Date:** 2026-09-19  
**Target:** Eliminate all fake, hardcoded, simulated data and no-op behaviors across the repository.

---

## Executive Summary

| Category | Total Items Identified | Real Backend Support Exists? | Action Required |
| :--- | :---: | :---: | :--- |
| **1. Hardcoded Data Arrays** | 13 | Yes (Phase 1 APIs ready) | Wire to API / Mongoose models with loading/empty/error states |
| **2. Fake Authentication** | 3 | Yes (`/api/auth/*` JWT ready) | Remove mock token & static credentials; use real database auth |
| **3. Fake Network Behavior** | 7 | Yes | Replace `setTimeout` / static promises with real API requests |
| **4. No-Op / Alert Submissions** | 8 | Yes (`/api/appointments`, etc.) | Replace `alert()` and `console.log()` with real API calls & toast alerts |
| **5. Fabricated Stats & Copy** | 4 | Yes (Compute from DB) | Replace fake numbers with computed values from database |
| **6. Placeholder UI** | 2 | Yes (Leaflet installed) | Replace placeholder with interactive Leaflet map & dynamic cards |
| **7. Fake Real-Time / Notifications** | 3 | Needs minimal API hook | Wire to real database notification collection |

---

## Detailed Findings by Category

### Category 1 — Hardcoded Arrays / Objects Standing in for Real Data

1. **`frontend/src/pages/portals/PatientPortal.jsx`**
   - **Current:** Hardcoded `SPECIALISTS` array (6 doctors with fabricated ratings, fees, reviews) and `DEPT_FILTERS`.
   - **Backend Status:** `GET /api/doctors` and `GET /api/specialties` endpoints are already live.
   - **Remediation Plan:** Fetch dynamic doctors and specialties from API with skeleton loading and empty states.

2. **`frontend/src/components/home/DoctorList.jsx`**
   - **Current:** Hardcoded `doctors` array of 4 specialists.
   - **Backend Status:** `GET /api/doctors` exists.
   - **Remediation Plan:** Connect to `GET /api/doctors` or use dynamic list from discovery service.

3. **`frontend/src/pages/portals/DoctorPortal.jsx`**
   - **Current:** Hardcoded `initialAppointments` array (4 appointments).
   - **Backend Status:** `GET /api/doctor/appointments` and `GET /api/appointments` exist.
   - **Remediation Plan:** Load appointments dynamically from `/api/doctor/appointments`.

4. **`frontend/src/components/doctor/pages/DoctorPatients.jsx`**
   - **Current:** Hardcoded `initialPatients` array with static timelines and lab reports.
   - **Backend Status:** `GET /api/patient` controller exists.
   - **Remediation Plan:** Fetch from backend patient API; label any demo medical histories clearly as `DEMO DATA`.

5. **`frontend/src/components/doctor/pages/DoctorMedicalRecords.jsx`**
   - **Current:** Hardcoded `initialRecords` array (CBC, Hypertension, Bronchitis).
   - **Backend Status:** Stored in appointment/consultation records on backend.
   - **Remediation Plan:** Wire to real appointments/consultations or add explicit `DEMO DATA` badge.

6. **`frontend/src/components/doctor/pages/DoctorDashboard.jsx`**
   - **Current:** Hardcoded stats (`Appointments: 8`, `Patients Waiting: 3`, `Pending Reports: 12`, `Avg Consult: 14m`).
   - **Backend Status:** Real queue and appointments data available via `/api/doctor/queue/:name`.
   - **Remediation Plan:** Compute KPIs dynamically from active appointments and queue.

7. **`frontend/src/context/PharmacyContext.jsx`**
   - **Current:** `initialInventory`, `initialPrescriptions`, `recentDispenses`, `orders`, `pharmacistProfile`.
   - **Backend Status:** `/api/pharmacy/inventory` and `/api/pharmacy/prescriptions` exist.
   - **Remediation Plan:** Replace hardcoded initial state with API fetch lifecycle.

8. **`frontend/src/context/ReceptionContext.jsx`**
   - **Current:** `initialAppointments`, `initialQueueState`, `initialInvoices`.
   - **Backend Status:** `/api/reception/appointments`, `/api/reception/queue`, `/api/reception/invoices` exist.
   - **Remediation Plan:** Fetch from reception service with fallback to database sync.

9. **`frontend/src/context/AdminContext.jsx`**
   - **Current:** `initialUsers`, `initialLogs`, `initialInvoices`.
   - **Backend Status:** `/api/admin/users`, `/api/admin/logs`, `/api/admin/invoices` exist.
   - **Remediation Plan:** Ensure all CRUD operations directly synchronize with `/api/admin/*`.

10. **`frontend/src/context/StaffContext.jsx`**
    - **Current:** `initialTasks`, `initialSchedule`, `staffData`.
    - **Backend Status:** `/api/staff/tasks`, `/api/staff/members` exist.
    - **Remediation Plan:** Fetch tasks from `/api/staff/tasks`.

11. **`frontend/src/components/receptionist/pages/ReceptionDashboard.jsx`**
    - **Current:** `initialUrgentItems` array with static patient data.
    - **Backend Status:** `/api/reception/queue` exists.
    - **Remediation Plan:** Derive urgent items from live appointment & queue status.

12. **`frontend/src/services/feedback.service.js`**
    - **Current:** `DEFAULT_FEEDBACK` array of 3 hardcoded reviews.
    - **Backend Status:** `GET /api/feedback` and `POST /api/feedback` backed by MongoDB `Feedback` model.
    - **Remediation Plan:** Remove static array fallback; load directly from backend `/api/feedback`.

13. **`frontend/src/pages/public/Home.jsx`**
    - **Current:** `DEPARTMENTS` array with hardcoded specialist counts ("14 Specialists", "9 Specialists").
    - **Backend Status:** `GET /api/specialties` exists.
    - **Remediation Plan:** Dynamically load specialties from `/api/specialties`.

---

### Category 2 — Fake Authentication

1. **`frontend/src/context/AuthContext.jsx` (Lines 40-42)**
   - **Current:** Hardcodes `const token = "mock-jwt-token-12345";` during login.
   - **Backend Status:** Real JWT issued via `POST /api/auth/login`.
   - **Remediation Plan:** Store and use the actual JWT token returned by `authService.login()`.

2. **`frontend/src/services/auth.service.js` (Lines 3-34, 50-64)**
   - **Current:** Static `CREDENTIALS` dictionary and offline fallback password check.
   - **Backend Status:** MongoDB User collection with bcrypt hash verification ready.
   - **Remediation Plan:** Remove static credentials dictionary and offline bypass. All logins authenticate via `POST /api/auth/login`.

3. **`frontend/src/pages/auth/Login.jsx` (Lines 9-15)**
   - **Current:** `DEMO_ROLES` array with hardcoded credentials for auto-fill.
   - **Remediation Plan:** Retain as explicit "Quick Demo Logins" for evaluation, but ensure backend has these accounts registered in MongoDB/seeds so authentication is 100% genuine.

---

### Category 3 — Fake Network Behavior

1. **`frontend/src/services/auth.service.js` (Line 51)**
   - **Current:** `await new Promise(resolve => setTimeout(resolve, 300));`
   - **Remediation Plan:** Removed with removal of mock auth fallback.

2. **`frontend/src/components/doctor/modals/ChangePasswordModal.jsx` (Line 41)**
   - **Current:** `setTimeout` simulating password change.
   - **Remediation Plan:** Wire to `/api/auth/change-password` or user profile update endpoint.

3. **`frontend/src/components/doctor/modals/ScheduleFollowUpModal.jsx` (Line 27)**
   - **Current:** `setTimeout` simulating follow-up creation.
   - **Remediation Plan:** Wire to `POST /api/appointments`.

4. **`frontend/src/components/doctor/modals/AddClinicalNoteModal.jsx` (Line 45)**
   - **Current:** `setTimeout` simulating saving notes.
   - **Remediation Plan:** Wire to `POST /api/doctor/prescriptions` or appointment updates.

5. **`frontend/src/components/receptionist/modals/ChangePasswordModal.jsx` (Line 41)**
   - **Current:** `setTimeout` simulating password change.
   - **Remediation Plan:** Wire to real user password update API.

6. **`frontend/src/components/staff/modals/ChangePasswordModal.jsx` (Line 41)**
   - **Current:** `setTimeout` simulating password change.
   - **Remediation Plan:** Wire to real user password update API.

7. **`frontend/src/components/pharmacy/pages/PharmacyOrders.jsx` (Line 34)**
   - **Current:** `totalCost: selectedItems.length * 100` mock cost calculation.
   - **Remediation Plan:** Calculate real cost using actual medicine prices from inventory.

---

### Category 4 — No-Op / Fake Actions on Submit

1. **`frontend/src/components/home/AppointmentForm.jsx` (Lines 16-20)**
   - **Current:** `console.log` and `alert('Appointment request submitted!')`.
   - **Backend Status:** `POST /api/appointments` is live.
   - **Remediation Plan:** Wire to real API with proper validation, loading state, and confirmation card.

2. **`frontend/src/components/feedback/FeedbackForm.jsx` (Lines 8-14)**
   - **Current:** Standalone feedback component doing `console.log` and `alert('Thank you for your feedback!')`.
   - **Backend Status:** `POST /api/feedback` is live.
   - **Remediation Plan:** Wire directly to `feedbackService.submitFeedback()`.

3. **`frontend/src/components/auth/LoginForm.jsx` & `RegisterForm.jsx`**
   - **Current:** Redundant unused forms in `components/auth/` doing `console.log('Login attempt...')` and `console.log('Register attempt...')`.
   - **Remediation Plan:** Wire `RegisterForm` to `POST /api/auth/register` and delete or align `LoginForm`.

4. **`frontend/src/components/receptionist/pages/ReceptionRegistration.jsx` (Lines 25-33)**
   - **Current:** `console.log('Registering patient:', formData)` with simulated timeout.
   - **Backend Status:** `receptionService.createAppointment()` exists.
   - **Remediation Plan:** Wire to `receptionService.createAppointment()` with error handling.

5. **`frontend/src/components/doctor/modals/LabReportsPanel.jsx` (Lines 8-15)**
   - **Current:** `alert('Downloading ' + reportName)` and `alert('Opening ' + reportName)`.
   - **Remediation Plan:** Replace dummy alerts with real blob generation or clean modal preview.

6. **`frontend/src/components/doctor/pages/DoctorAppointments.jsx` (Lines 40, 234)**
   - **Current:** Browser `alert()` calls.
   - **Remediation Plan:** Replace browser `alert()` with inline error states and toast notifications.

---

### Category 5 — Fabricated Content & Stats in UI

1. **`frontend/src/pages/public/Home.jsx` (Lines 30-35)**
   - **Current:** Hardcoded statistics (`150+ Licensed Specialists`, `45,000+ Patient Consultations`, `< 6 mins Emergency Response`, `99.8% Clinical Accuracy`).
   - **Remediation Plan:** Replace with dynamic metrics calculated from database (e.g. actual doctor count, verified specialties, active departments) or label clearly as `DEMO DATA / BENCHMARKS`.

2. **`frontend/src/pages/public/About.jsx` (Lines 44-49, 112-130)**
   - **Current:** Invented numbers (`500+ Bed Capacity`, `150+ Super Specialists`, `98.9% Patient Approval`, `40k+ reviews`).
   - **Remediation Plan:** Replace with real counts or badge as facility specifications clearly marked as `DEMO FACILITY SPECIFICATIONS`.

3. **`frontend/src/components/common/Navbar.jsx` (Line 55)**
   - **Current:** Hardcoded `Average ER Wait: < 8 mins`.
   - **Remediation Plan:** Replace with dynamic status indicator or clean service banner.

4. **`frontend/src/components/admin/pages/AdminOverview.jsx` (Lines 37-60)**
   - **Current:** Hardcoded KPI numbers (`Total Users: 142`, `Doctors: 28`, `Patients: 854`).
   - **Remediation Plan:** Compute from `adminContext.users`, `appointments`, and `doctors` collections.

---

### Category 6 — Placeholder UI Pretending to be Functional

1. **`frontend/src/components/home/HospitalMap.jsx`**
   - **Current:** Static box with text `"Hospital Location Map Placeholder"`.
   - **Remediation Plan:** Replace with interactive Leaflet map component with real hospital markers.

2. **`frontend/src/components/home/DoctorCard.jsx`**
   - **Current:** `Photo` placeholder square.
   - **Remediation Plan:** Implement stylized avatar with doctor initials, specialty badge, and real profile preview.

---

### Category 7 — Fake Real-Time / Notification Behavior

1. **`frontend/src/components/receptionist/pages/ReceptionDashboard.jsx` (Lines 47-55)**
   - **Current:** Fake notification modal that only flips a boolean timeout `setNotificationSuccess(true)`.
   - **Remediation Plan:** Wire to backend notification logging in `User.notifications`.

2. **`frontend/src/components/staff/pages/StaffDashboard.jsx` & `StaffContext.jsx`**
   - **Current:** `timeLeft` countdown running on client `setInterval` without database sync.
   - **Remediation Plan:** Link shift times to real ISO timestamps from staff duty status.

---

## Suggested Remediation Order (Stage 2)

1. **Authentication & Token Management** (Remove mock token, connect real JWT, delete credentials bypass)
2. **Core Data Fetching & Contexts** (Connect `PatientPortal`, `DoctorPortal`, `PharmacyContext`, `AdminContext`, `ReceptionContext`, `StaffContext` to backend APIs)
3. **Form Submissions & Actions** (Replace all `console.log`/`alert` handlers with real API calls and toast feedback)
4. **UI Copy & Statistics** (Compute counts dynamically from DB / label demo statistics explicitly)
5. **Interactive UI Replacements** (Replace `HospitalMap` with Leaflet OpenStreetMap)
6. **Final Cleanup Sweep** (Verify no leftover mock tokens, static alerts, or fake simulated promises)
