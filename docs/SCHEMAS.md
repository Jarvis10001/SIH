# Project Schemas Reference

This document lists all Mongoose schemas and major data structures used in the project. It is generated from the models located in `backend/models` and includes field names, types, constraints, and notes about indexes, virtuals, and middleware.

---

## 1) Teacher (`backend/models/Teacher.js`)
- Collection: `teachers` (model exported as `Teacher`)
- Key fields:
  - `teacherId` (String, required, unique, uppercase) — generated if missing (format `TCHYYYYDEPxNNN`).
  - `password` (String, required, min 6) — hashed in pre-save middleware.
  - `personalInfo` (Object)
    - `firstName` (String, required)
    - `lastName` (String, required)
    - `email` (String, required, unique, lowercase, email match)
    - `phone` (String, required, Indian mobile pattern)
    - `alternatePhone`, `dateOfBirth`, `gender`, `bloodGroup`, `aadharNumber`, `panNumber`
  - `address` (Object)
    - `currentAddress` / `permanentAddress` (street, city, state, pincode, country)
    - `isSameAddress` (Boolean)
  - `professionalInfo` (Object)
    - `employeeId` (String, unique)
    - `designation` (String, enum)
    - `department`, `specialization`, `qualification`, `experience`, `joiningDate`, `employmentType`
    - `salary` (basic, allowances, total) — total calculated in pre-save
  - `academicInfo` (Array & Objects): `subjects`, `researchAreas`, `publications`, `projects`
  - `systemInfo` (Object): `status`, `lastLogin`, `loginAttempts`, `accountLocked`, `passwordResetToken`, `createdBy`, `modifiedBy`
  - `documents` (profilePhoto, resume, certificates[])
- Indexes: `teacherId`, `personalInfo.email`, `professionalInfo.employeeId`, `professionalInfo.department`, `systemInfo.status`
- Virtuals: `fullName`, `age`
- Middleware: pre-save for password hashing, salary total calc, address copy, id generation
- Instance methods: `comparePassword`, `incrementLoginAttempts`, `resetLoginAttempts`, `isAccountLocked`, `isActive`
- Statics: `findByTeacherId`, `findByDepartment`, `getTeacherStats`

---

## 2) Student (`backend/models/Student.js`)
- Collection: `students`
- Key fields:
  - `name` (Object): `firstName`, `lastName`, `middleName` — validation on lengths
  - `email` (String, required, unique, match)
  - `studentId` (String, required, unique, uppercase, match)
  - `year` (Number, 1-6)
  - `branch` (String, enum)
  - `semester` (Number, 1-12)
  - `password` (String, required, minlength 6, `select: false`) — hashed pre-save
  - `personalInfo` (dateOfBirth, gender, bloodGroup, nationality, religion, category)
  - `contact` (phone primary/secondary, address permanent/current)
  - `guardian` (father/mother/guardian objects)
  - `academics` (admissionDate, admissionType, rollNumber, section, cgpa, previousEducation)
  - `status` (isActive, isGraduated, graduationDate, accountStatus enum)
  - `security` (emailVerified, tokens, passwordReset, lastLogin, refreshTokens array)
  - `documents` (profilePhoto, signature, documents[])
  - `fees` (totalFees, paidAmount, pendingAmount, lastPaymentDate)
  - `hostel` (isHostelStudent, hostelName, roomNumber, floorNumber)
  - `transport` (usesTransport, routeNumber, stopName)
- Indexes: `year, branch`, `semester`, `status.isActive`, `status.accountStatus`, `createdAt` and unique indexes by field
- Virtuals: `fullName`, `age`
- Middleware: pre-save password hashing, pendingFees calculation, roll number auto-generation
- Instance methods: `comparePassword`, `getFullName`, `getAge`, `addRefreshToken`, `removeRefreshToken`
- Statics: `findByStudentIdWithPassword`, `findByBranchAndYear`, `findActiveStudents`
- Notes: `toJSON` method strips sensitive tokens/passwords

---

## 3) Clerk (`backend/models/Clerk.js`)
- Collection: `clerks` (model name `Clerk`)
- Key fields:
  - `employeeId` (String, required, unique)
  - `personalInfo.fullName`, `personalInfo.email`, `personalInfo.phone`, `dateOfBirth`, `gender`, `address`, `emergencyContact`
  - `professionalInfo` (designation, department, joiningDate, experience, reportingTo, workShift, salary)
  - `systemAccess` (modules[], accessLevel enum)
  - `password` (String, required, `select:false`) — hashed pre-save
  - `isActive`, `lastLogin`, `profilePicture`, `createdBy`, `createdAt`, `updatedAt`
- Indexes: `employeeId`, `personalInfo.email`, `professionalInfo.department`, `isActive`
- Plugins: `mongoose-paginate-v2`
- Middleware: pre-save hash password, update `updatedAt`
- Methods: `comparePassword`, `getFullName`, `hasModuleAccess`
- Statics: `findByEmployeeId`, `findActive`, `findByDepartment`
- Virtuals: `experienceDisplay`
- `toJSON` removes password

---

## 4) Attendance (`backend/models/Attendance.js`)
- Collection: `attendances` (model `Attendance`)
- Key fields:
  - `classInfo` (subject, subjectCode, className, section, semester, academicYear (format `YYYY-YYYY`))
  - `date` (Date)
  - `timeSlot` (startTime, endTime) - HH:mm format
  - `teacherInfo` (teacherId ref, teacherName)
  - `studentAttendance` (array of objects):
    - `studentId`, `studentName`, `rollNumber`, `status` enum (Present, Absent, Late, Excused), `remarks`
  - `statistics` (computed totals: totalStudents, presentCount, absentCount, lateCount, excusedCount, attendancePercentage)
  - `uploadInfo` (fileName, uploadedAt, fileSize, originalData[])
  - `createdAt`, `updatedAt`, `isActive`
- Indexes: class/section/date, teacherId/date, studentId/date, academicYear/semester
- Middleware: pre-save to compute statistics and updatedAt
- Statics: `getStudentAttendance(studentId, academicYear, semester)`, `getClassAttendance(classInfo, startDate, endDate)`, `getTeacherAttendance(teacherId, startDate, endDate)`
- Methods: `getAttendancePercentage`, `getStudentRecord`

---

## 5) Admin (`backend/models/Admin.js`)
- Collection: `admins`
- Key fields:
  - `username` (String, required, unique)
  - `password` (String, required) — hashed pre-save
  - `personalInfo` (firstName, lastName, email, phone)
  - `role` (enum: Super Admin, Academic Admin, HR Admin, Finance Admin)
  - `permissions` (nested object for modules e.g., students, teachers, admissions, payments, reports, system)
  - `systemInfo` (status, lastLogin, loginAttempts, accountLocked, passwordResetToken, twoFactorEnabled, sessionId, ipAddress, userAgent)
  - `activityLog` (array of action logs)
  - `profile` (avatar, bio, department, designation)
- Indexes: `username`, `personalInfo.email`, `systemInfo.status`, `role`
- Virtuals: `fullName`
- Middleware: pre-save password hash
- Methods: `comparePassword`, `incrementLoginAttempts`, `resetLoginAttempts`, `isAccountLocked`, `isActive`, `hasPermission`, `logActivity`
- Statics: `findByUsername`, `createDefaultAdmin()`

---

## 6) Payment (`backend/models/Payment.js`)
- Collection: `payments`
- Key fields:
  - `userId` (ObjectId ref User), `admissionId` (ObjectId ref Admission), `orderId` (unique), `paymentId`, `signature`
  - `amount`, `currency` (INR default), `status` (pending/completed/failed/cancelled)
  - `paymentMethod`, `paymentGateway` (default `razorpay`), `paidAt`, `razorpayResponse` (mixed)
  - `transactionDetails` (orderCreation, paymentAttempts[], paymentCompletion{})
  - `sessionInfo` (ipAddress, userAgent, deviceType, browser, platform, screenResolution, timezone, language)
  - `statusHistory` (array of status changes)
  - `feeBreakdown` (admissionFee, registrationFee, securityDeposit, otherFees)
  - `refundId`, `refundAmount`, `refundStatus` (enum), `refundReason`, `refundedAt`
  - `receipt`, `notes`, `ipAddress`, `userAgent`
- Indexes: userId/status, admissionId/status, createdAt, paidAt
- Plugins: `mongoose-paginate-v2`
- Virtuals: `netAmount`, `receiptUrl`
- Middleware: pre-save to initialize transaction details and status history, default fee breakdown
- Methods: `isCompleted`, `canRefund`, `addPaymentAttempt`, `updateOrderCreation`, `completePayment`, `setSessionInfo`, `changeStatus`, `getReceiptData`, `getTransactionSummary`
- Statics: `findByUserId`, `getPaymentStats`

---

## 7) Admission (`backend/models/Admission.js`)
- Collection: `admissions`
- Key fields:
  - `userId` (ObjectId ref User, unique)
  - `personalInfo` (name, fatherName, motherName, gender, dateOfBirth, mobileNo, parentsMobileNo, email, bloodGroup, aadharNo)
  - `addressInfo` (address, city, state, pincode, isOtherState, domicileState)
  - `academicInfo` (course enum, branch, tenth, twelfth, jee details)
  - `categoryInfo` (category enum, isMinority, minorityType)
  - `emergencyContact` (name, relation, mobile)
  - `documents` (structured `documentSchema` with cloudinary info, verificationStatus, verificationNotes, verifiedBy ref Clerk, verifiedAt)
  - `status`, `adminRemarks`, `applicationNumber` (unique generated `ADMYYYYNNNN`), `paymentStatus`, `admissionStatus`
  - `verificationStatus`, `verifiedBy`, `verifiedAt`, `studentId`, `feeAmount`
- Indexes: userId, personalInfo.aadharNo, status, academicInfo.course, academicInfo.branch, submittedAt, applicationNumber, verificationStatus, studentId, verifiedBy
- Middleware: pre-save to generate `applicationNumber`
- Virtuals: `personalInfo.age`
- Methods: `hasAllRequiredDocuments`, `getMissingDocuments`
- Statics: `getStatistics`, `getCourseWiseStats`

---

## 8) User (in-memory mock) (`backend/models/User.js`)
- Simple mock array of users with fields: `id`, `name`, `email`, `password` (hashed sample), `role`, `createdAt`
- Exposes utility functions for CRUD and validation used by legacy routes.

---

## 9) Data (`backend/models/Data.js`)
- Simple in-memory sample data service used for demo/test endpoints.
- Items: `{ id, name, type, description }` with helper methods.

---

### How I built this file
- Extracted field definitions, enums, indexes, middleware, virtuals, statics, and instance methods from model files in `backend/models`.
- Omitted internal helper functions and implementation details unless relevant to schema behavior (e.g., password hashing).

---

If you'd like, I can:
- Output this as a JSON Schema file per model instead of Markdown.
- Add example documents for each schema.
- Add a diagram (Mermaid) showing relationships between collections.

Which of those would you like next?

---

## Object Structure Details
Below are explicit object -> field mappings for the nested objects used in each schema. This clarifies what data lives inside each object.

### Teacher
- `personalInfo`:
  - `firstName`, `lastName`, `email`, `phone`, `alternatePhone`, `dateOfBirth`, `gender`, `bloodGroup`, `aadharNumber`, `panNumber`
- `address`:
  - `currentAddress`:
    - `street`, `city`, `state`, `pincode`, `country`
  - `permanentAddress`:
    - `street`, `city`, `state`, `pincode`, `country`
  - `isSameAddress` (boolean)
- `professionalInfo`:
  - `employeeId`, `designation`, `department`, `specialization`, `qualification`, `experience`, `joiningDate`, `employmentType`
  - `salary`:
    - `basic`, `allowances`, `total`
- `academicInfo`:
  - `subjects[]` (objects with `name`, `code`, `semester`, `branch`, `credits`)
  - `researchAreas[]` (strings)
  - `publications[]` (objects with `title`, `journal`, `year`, `coAuthors[]`, `doi`)
  - `projects[]` (objects with `title`, `fundingAgency`, `amount`, `startDate`, `endDate`, `status`)
- `systemInfo`:
  - `status`, `lastLogin`, `loginAttempts`, `accountLocked`, `passwordResetToken`, `passwordResetExpires`, `createdBy`, `modifiedBy`
- `documents`:
  - `profilePhoto`, `resume` (objects: `filename`, `originalName`, `url`, `publicId`, `uploadedAt`)
  - `certificates[]` (objects: `type`, `title`, `filename`, `originalName`, `url`, `publicId`, `uploadedAt`)

### Student
- `name`:
  - `firstName`, `middleName`, `lastName`
- Top-level fields: `email`, `studentId`, `year`, `branch`, `semester`, `password`
- `personalInfo`:
  - `dateOfBirth`, `gender`, `bloodGroup`, `nationality`, `religion`, `category`
- `contact`:
  - `phone`:
    - `primary`, `secondary`
  - `address`:
    - `permanent` (`street`, `city`, `state`, `pinCode`, `country`)
    - `current` (`street`, `city`, `state`, `pinCode`, `country`, `isSameAsPermanent`)
- `guardian`:
  - `father`: (`name`, `occupation`, `phone`, `email`, `annualIncome`)
  - `mother`: (`name`, `occupation`, `phone`, `email`)
  - `guardian` (optional): (`name`, `relation`, `phone`, `email`)
- `academics`:
  - `admissionDate`, `admissionType`, `rollNumber`, `section`, `cgpa`
  - `previousEducation`:
    - `tenthGrade` (board, school, percentage, yearOfPassing)
    - `twelfthGrade` (board, school, percentage, yearOfPassing)
- `status`:
  - `isActive`, `isGraduated`, `graduationDate`, `accountStatus`
- `security`:
  - `emailVerified`, `emailVerificationToken`, `passwordResetToken`, `passwordResetExpires`, `lastLogin`, `refreshTokens[]`
- `documents`:
  - `profilePhoto`, `signature`, `documents[]` (each: `name`, `type`, `filePath`, `uploadedAt`)
- `fees`:
  - `totalFees`, `paidAmount`, `pendingAmount`, `lastPaymentDate`
- `hostel`: `isHostelStudent`, `hostelName`, `roomNumber`, `floorNumber`
- `transport`: `usesTransport`, `routeNumber`, `stopName`

### Clerk
- `employeeId` (top-level)
- `personalInfo`:
  - `fullName`, `email`, `phone`, `dateOfBirth`, `gender`, `address` (street, city, state, pincode, country), `emergencyContact` (name, relationship, phone)
- `professionalInfo`:
  - `designation`, `department`, `joiningDate`, `experience`, `reportingTo`, `workShift`, `salary` (`basic`, `allowances`, `total`)
- `systemAccess`:
  - `modules[]` (strings), `accessLevel` (read/write/admin)
- `password` (stored hashed), `isActive`, `lastLogin`, `profilePicture` (`url`, `publicId`), `createdBy`, `createdAt`, `updatedAt`

### Attendance
- `classInfo`:
  - `subject`, `subjectCode`, `className`, `section`, `semester`, `academicYear` (string `YYYY-YYYY`)
- `date`, `timeSlot` (`startTime`, `endTime`)
- `teacherInfo` (`teacherId`, `teacherName`)
- `studentAttendance[]`:
  - Each record: `studentId`, `studentName`, `rollNumber`, `status` (Present/Absent/Late/Excused), `remarks`
- `statistics` (`totalStudents`, `presentCount`, `absentCount`, `lateCount`, `excusedCount`, `attendancePercentage`)
- `uploadInfo` (`fileName`, `uploadedAt`, `fileSize`, `originalData[]`)

### Admin
- `username`, `password`
- `personalInfo` (`firstName`, `lastName`, `email`, `phone`)
- `role`, `permissions` (nested per-module CRUD flags), `systemInfo` (`status`, `lastLogin`, `loginAttempts`, `accountLocked`, `twoFactorEnabled`, etc.)
- `activityLog[]` (action, target, targetId, details, timestamp, ipAddress)
- `profile` (avatar, bio, department, designation)

### Payment
- `userId`, `admissionId`, `orderId`, `paymentId`, `signature`
- `amount`, `currency`, `status`, `paymentMethod`, `paymentGateway`, `paidAt`, `razorpayResponse`
- `transactionDetails`:
  - `orderCreation` (timestamp, razorpayOrderId, orderAmount, orderCurrency, orderStatus, orderReceipt)
  - `paymentAttempts[]` (attemptNumber, timestamp, paymentId, method, bank, wallet, vpa, cardType, cardNetwork, status, errorCode, errorDescription, gatewayResponse)
  - `paymentCompletion` (timestamp, razorpayPaymentId, verificationStatus, finalAmount, fees, tax, settlementAmount)
- `sessionInfo` (ipAddress, userAgent, deviceType, browser, platform, screenResolution, timezone, language)
- `statusHistory[]` (status, timestamp, reason, changedBy, metadata)
- `feeBreakdown` (admissionFee, registrationFee, securityDeposit, otherFees)
- `refundId`, `refundAmount`, `refundStatus`, `refundReason`, `refundedAt` 

### Admission
- `userId` (ref User)
- `personalInfo` (name, fatherName, motherName, gender, dateOfBirth, mobileNo, parentsMobileNo, email, bloodGroup, aadharNo, religion, nationality)
- `addressInfo` (address, city, state, pincode, isOtherState, domicileState)
- `academicInfo` (course, branch, tenth, twelfth, jee)
- `categoryInfo` (category, isMinority, minorityType)
- `emergencyContact` (name, relation, mobile)
- `documents` (per-document: `filename`, `originalName`, `path`, `url`, `publicId`, `size`, `mimetype`, `cloudinaryData`, `uploadedAt`, `verificationStatus`, `verificationNotes`, `verifiedBy`, `verifiedAt`)
- `status`, `adminRemarks`, `applicationNumber`, `submittedAt`, `reviewedAt`, `reviewedBy`, `paymentStatus`, `admissionStatus`, `verificationStatus`, `verifiedBy`, `verifiedAt`, `studentId`, `feeAmount`

### User (mock)
- Array items contain: `id`, `name`, `email`, `password` (hashed), `role`, `createdAt`

### Data (sample)
- Array items contain: `id`, `name`, `type`, `description`, `createdAt`, optionally `updatedAt`

---

Progress: added detailed object mappings to `d:\SIH\docs\SCHEMAS.md`.

Next steps (optional):
- Generate JSON Schema files for each model.
- Add example documents for each schema.
- Create a Mermaid ER diagram showing relationships (Student, Teacher, Clerk, Admission, Payment, Attendance links).yeah 