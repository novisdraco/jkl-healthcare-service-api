// routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  currentUser,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const {
  createPatient,
  updatePatient,
  deletePatient,
  getPatientDetails,
  getAllPatientDetails,
} = require("../controllers/patientController");

const {
  assignCaregiver,
  unassignCaregiver,
  getAllCaregiver,
  getAssignedList,
  updateCareGiver,
  getUnassignedList,
} = require("../controllers/caregiverController");

const {
  scheduleAppointment,
  updateScheduleAppointment,
  getAllAppointment,
} = require("../controllers/appointmentController");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected route example

// Fetch Current Logged In User
router.get("/users/currentUser", auth, currentUser);
// Patient API's
router.post("/patient/createPatient", auth, createPatient);
router.put("/patient/updatePatient", auth, updatePatient);
router.delete("/patient/deletePatient", auth, deletePatient);
router.get("/patient/getPatientDetails", auth, getPatientDetails);
router.get("/patient/getAllPatientDetails", auth, getAllPatientDetails);

// Caregiver API's
router.put("/caregiver/updateCareGiver", auth, updateCareGiver);
router.post("/caregiver/assignCaregiver", auth, assignCaregiver);
router.delete("/caregiver/unassignCaregiver", auth, unassignCaregiver);
router.get("/caregiver/getAllCaregiver", auth, getAllCaregiver);
router.get(
  "/caregiver/getAssignedList",
  auth,
  getAssignedList
);
router.get("/caregiver/getUnassignedList", auth, getUnassignedList);

// Appointment API's
router.post("/appointment/scheduleAppointment", auth, scheduleAppointment);
router.put(
  "/appointment/updateScheduleAppointment",
  auth,
  updateScheduleAppointment
);
router.get("/appointment/getAllAppointment", auth, getAllAppointment);

module.exports = router;
