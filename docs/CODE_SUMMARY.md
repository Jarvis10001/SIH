# CODE_SUMMARY

Purpose: a concise developer-oriented map of what each major file/page does and the core functions/behaviour to help onboard or debug quickly.

**Project Layout**
- `backend/` — Express API, Mongoose models, controllers, routes, middleware, and seed/test scripts.
- `front/` (or `frontend/`) — React + Vite frontend, UI components for Admin/Teacher/Clerk/Student flows.
- `docs/` — generated JSON Schemas, `SCHEMAS.md`, credentials, and this `CODE_SUMMARY.md`.

**Backend - entry & config**
- `backend/server.js`: App bootstrap. Registers middleware (logger, JSON parsing), route mounts (`/api/teacher`, `/api/students`, `/api/clerk`, `/api/attendance`, `/api/payment`, `/api/admission`, `/api/admin`, `/api/auth`, etc.), and error handler.
- `backend/config/database.js`: MongoDB connection logic (Mongoose connect and options).
- `backend/config/cloudinary.js`: Cloudinary configuration helper used by upload/Admission flows.
- `backend/utils/jwt.js`: JWT helper for signing/verifying tokens and building auth payloads.

**Backend - middleware**
- `backend/middleware/auth.js`: Protects routes using JWT; extracts token, verifies role-based access and attaches user to `req`.
- `backend/middleware/validation.js`: Request validation helpers (payload checks) used by controllers/routes.
- `backend/middleware/logger.js`: Request logging for development (method, path, timing).
- `backend/middleware/errorHandler.js`: Centralized Express error handling and response formatting.

**Backend - models (Mongoose)**
- `backend/models/Teacher.js`: Teacher schema — `teacherId`, password (hashed), personal/professional info, virtuals (fullName, age), pre-save hooks (id generation, hash), instance methods (`comparePassword`), and statics for lookups.
- `backend/models/Student.js`: Student schema — `studentId`, name, email, academics, fee/hostel fields, password hashing hook, and helper methods for roll numbers and fee calculations.
- `backend/models/Clerk.js`: Clerk schema — `employeeId`, system access modules, password hashing.
- `backend/models/Attendance.js`: Attendance schema — class/subject info, `academicYear` (format `YYYY-YYYY`), `studentAttendance[]` array, pre-save to compute attendance statistics, and statics for queries by student/class/teacher.
- `backend/models/Admin.js`: Admin user schema and permissions.
- `backend/models/Payment.js`: Payment record schema for student fees and their statuses.
- `backend/models/Admission.js`: Admission application schema including uploaded document metadata.
- `backend/models/User.js` / `backend/models/UserMongo.js`: Light-weight or example user models (used by some endpoints / tests).
- `backend/models/Data.js`: Generic key/value store used by utilities or tests.

**Backend - controllers**
- `backend/controllers/teacherController.js`: Handles teacher-specific flows: login (expects `teacherId` + password), profile, teacher-specific attendance actions, and teacher utilities.
- `backend/controllers/StudentController.js`: Student signup/login (email), profile, and endpoints to fetch student-specific attendance and payment data.
- `backend/controllers/clerkController.js`: Clerk operations — login, student verification, document verification endpoints, and clerical actions.
- `backend/controllers/attendanceController.js`: Create/edit attendance records (teacher-facing), query attendance by class/date/student, and compute aggregates.
- `backend/controllers/paymentController.js`: Create and fetch payments; mark status (pending/completed/failed).
- `backend/controllers/admissionController.js`: Manage admission forms, uploads via Cloudinary, and application lifecycle.
- `backend/controllers/adminController.js`: Admin-only operations — create teachers/clerks, manage users, view reports.
- `backend/controllers/AuthController.js`: Central auth flows (token refresh, generic login helpers) used by client login components.
- `backend/controllers/UserController.js` and `UserControllerMongo.js`: Utility controllers for testing or alternate user persistence.

**Backend - routes**
- `backend/routes/teacher.js`: Mount `/api/teacher` endpoints — `POST /login` (teacher login), teacher operations.
- `backend/routes/students.js`: Mount `/api/students` endpoints — `POST /login`, student-related endpoints.
- `backend/routes/clerk.js`: Mount `/api/clerk` endpoints — clerk login and verification endpoints.
- `backend/routes/attendance.js`: Mount `/api/attendance` endpoints — attendance CRUD and queries.
- `backend/routes/payment.js`: Mount `/api/payment` endpoints — payments CRUD.
- `backend/routes/admission.js`: Mount `/api/admission` endpoints — admission form operations and uploads.
- `backend/routes/admin.js`: Admin-specific endpoints.
- `backend/routes/auth.js`: Token refresh and common auth helpers.
- `backend/routes/users.js` and `usersMongo.js`: Test utility routes for user management and migration.

**Backend - scripts & tests**
- `backend/scripts/*seed*.js` (many variants): Multiple seeding scripts for teachers, students, clerks, attendance, admin. Note: some earlier seeds had double-hashing issues; prefer `seed*corrected.js` versions.
- `backend/scripts/seedAttendanceData.js` / `seedAttendance.js`: Create bulk attendance test data (teacher-driven attendance entries).
- `backend/scripts/runCompleteSeeding.js`: Orchestrates seeding of all collections.
- `backend/scripts/test*` files: small scripts that exercise APIs (login, attendance posting) useful for headless verification.
- `backend/scripts/decodeToken.js`: Helper to decode JWTs for debugging.

**Frontend - entry & config**
- `front/src/main.jsx`: React entrypoint — mounts `App` into DOM; sets up providers (if any).
- `front/src/App.jsx`: Router & top-level layout selection (routes for admin/teacher/clerk/student dashboards and public pages) and auth wrapper usage.
- `front/tailwind.config.js`, `front/postcss.config.js`: Tailwind and build configuration.

**Frontend - utils & context**
- `front/src/utils/tokenUtils.js`: Store/remove tokens, read role from token, helper for attaching Authorization header.
- `front/src/context/SidebarContext.jsx`: Sidebar state (open/closed) and app-level UI context.

**Frontend - common layout components**
- `front/src/components/TopNav.jsx`: Top navigation bar used across dashboards; handles logout and token-aware links.
- `front/src/components/Sidebar.jsx`: Global sidebar used in dashboards; renders navigation links per role.
- `front/src/components/Navbar.jsx`: Public site navbar used on landing pages.

**Frontend - Auth & Entry pages**
- `front/src/components/Login.jsx`: Generic login form used by different roles (or delegates to role-specific forms); submits credentials to appropriate backend route (student, teacher, clerk, admin).
- `front/src/components/SignUp.jsx`: Student/admission signup page — posts to admission or student signup endpoint.

**Frontend - Student pages/components**
- `front/src/components/student/StudentAttendance.jsx`: Fetches attendance data for the logged-in student (calls `/api/attendance` filters) and displays per-subject/term attendance and percentages. Key functions: `fetchAttendance`, rendering attendance rows, formatting academic year.
- `front/src/components/student/DocumentStatus.jsx`: Shows uploaded document verification status (calls clerk/admission endpoints to check).

**Frontend - Teacher pages/components**
- `front/src/components/teacher/TeacherLogin.jsx`: Teacher login UI — submits `{ teacherId, password }` to `/api/teacher/login` and saves token.
- `front/src/components/teacher/TeacherTopNav.jsx` and `TeacherSidebar.jsx`: Role-specific nav and links.
- `front/src/components/teacher/pages/TeacherDashboardHome.jsx`: Teacher landing with summary widgets and quick links.
- `front/src/components/teacher/pages/TeacherStudents.jsx`: Lists students for teacher's classes; supports searching and quick actions.
- `front/src/components/teacher/pages/TeacherAttendance.jsx` and `front/src/components/Teacher/AttendanceManagement.jsx` (frontend folder): Teacher-facing attendance creation/edition UI. Key functions: `fetchClassStudents`, `createAttendanceRecord` (POST `/api/attendance`), `togglePresent` per student, form validation (academicYear format `YYYY-YYYY`), and update attendance stats.
- Other teacher pages: `TeacherSchedule.jsx`, `TeacherAssignments.jsx`, `TeacherGrades.jsx`, `TeacherResources.jsx`, `TeacherReports.jsx`, `TeacherProfile.jsx`, `TeacherSettings.jsx` — UI shells that call respective APIs if implemented in backend.

**Frontend - Clerk pages/components**
- `front/src/components/clerk/ClerkLogin.jsx`: Clerk login form POST to `/api/clerk/login`.
- `front/src/components/clerk/ClerkDashboard.jsx`: Clerk home UI showing quick actions (student verification, document verification, payment shortcuts). Contains widgets and hooks that call clerk endpoints to fetch verification tasks.
- `front/src/components/clerk/StudentVerification.jsx`: UI to search student by ID/email and mark verification status; calls clerk controller endpoints.
- `front/src/components/clerk/DocumentVerification.jsx`: Review uploaded documents and mark accepted/rejected; calls admission/document endpoints.
- `front/src/components/clerk/ClerkSidebar.jsx` / `ClerkTopNav.jsx`: Clerk-specific navigation components.

**Frontend - Admin pages/components**
- `front/src/components/admin/AdminLogin.jsx`: Admin login page.
- `front/src/components/admin/AdminDashboard.jsx`: Admin home with user management widgets and links to `TeacherForm.jsx` and `ClerkForm.jsx`.
- `front/src/components/admin/TeacherForm.jsx` and `ClerkForm.jsx`: Admin forms to create/update teacher and clerk records (POST/PUT to `/api/teacher` and `/api/clerk`).

**Frontend - Pages & Public UI**
- `front/src/components/pages/*`: Admission forms (`AdmissionForm.jsx`, `AdmissionForm2.jsx`, `AdmissionFormNew.jsx`), `PaymentPage.jsx`, and `PaymentReceipt.jsx` — these call `/api/admission` and `/api/payment` endpoints, and integrate Cloudinary upload where needed.
- `front/src/components/LandingPage.jsx` and `HeroSlider.jsx`: Marketing/public site UI for visitors.

**Testing & Dev Helpers (useful files)**
- `TEST_CREDENTIALS.md`, `backend/TEST_CREDENTIALS.md`, `docs/ALL_CREDENTIALS.txt`: Lists of test accounts and passwords used when exercising login flows.
- `backend/scripts/test*api.js`: Quick node scripts to POST login requests and exercise endpoints. Use PowerShell `Invoke-RestMethod` examples for manual testing.

**Notable behaviours & gotchas discovered earlier**
- Teacher login expects `teacherId` (e.g., `TEACH001`), not email. Route is `/api/teacher/login` (singular).
- Some seed scripts double-hashed passwords; use `*_corrected.js` or `insertMany` with already-hashed passwords.
- Academic year format mismatch: backend expects `YYYY-YYYY` (e.g., `2024-2025`); frontend previously used shortened `2024-25` in a few places — this was fixed in `StudentAttendance.jsx`.
- Clerk Dashboard theme was using green variants; updated to app blue/cyan theme in `ClerkDashboard.jsx`.
- Attendance pre-save computes statistics automatically; APIs that create attendance should send full `studentAttendance[]` and required classInfo.

**Where to look next (recommended checkpoints)**
- To verify authentication and seeded users: run `backend/scripts/testStudentLogin.js` or use PowerShell `Invoke-RestMethod` to `POST` to `/api/students/login` and `/api/teacher/login` with credentials from `docs/ALL_CREDENTIALS.txt`.
- To inspect attendance creation flow: review `front/src/components/teacher/AttendanceManagement.jsx` and `backend/controllers/attendanceController.js`.
- To extend schemas or generate examples: `d:\SIH\docs\json-schemas` contains Draft-07 JSON Schemas for models.

**File index (quick reference)**
- Backend: `server.js`, `config/*`, `models/*`, `controllers/*`, `routes/*`, `middleware/*`, `scripts/*`.
- Frontend: `front/src/main.jsx`, `front/src/App.jsx`, `front/src/components/*` (organized by role), `front/src/utils/*`, `front/src/context/*`.

If you want, I can now:
- Generate a per-file detailed function-by-function summary (reads each file and documents each exported function and route handler). This will produce a larger `CODE_SUMMARY_DETAILED.md`.
- Or I can add example requests for each key endpoint and runnable PowerShell snippets to `docs/API_TESTS.md`.

Tell me which of those you'd like next, or I can proceed to produce the detailed per-file document automatically.