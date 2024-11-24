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



module.exports = router;
