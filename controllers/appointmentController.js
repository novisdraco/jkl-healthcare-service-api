const db = require("../config/db");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

// Schedule Appointment
exports.scheduleAppointment = async (req, res) => {
  const { patientId, caregiverId, appointmentDate } = req.body;
  const sql =
    "insert into appointments (patient_id, caregiver_id, appointment_date, notification_sent) values (?, ?, ?, true)";
  db.query(sql, [patientId, caregiverId, appointmentDate], (err, results) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    const sqlEmail = "select email from patients where patient_id = ?";
    db.query(sqlEmail, [patientId], (error, patientResult) => {
      if (patientResult.length > 0) {
        const email = patientResult[0]["email"];
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Appointment Confirmation",
          text: `Dear Patient, your appointment is scheduled on ${appointmentDate}. Please contact if any queries.`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("error", error);
            res.send({ message: "Appointment Scheduled Failed", status: 500 });
          } else {
            res.send({
              message: "Appointment Scheduled Successfully",
              status: 200,
            });
          }
        });
      } else {
        res.send({ message: "Patient email not found", status: 404 });
      }
    });
    res.send({ message: "Appointment Scheduled", status: 200 });
  });
};

//Update Appointment Scheduled
exports.updateScheduleAppointment = async (req, res) => {
  const { appointmentId, appointmentDate, patientId } = req.body;
  const sql =
    "update appointments set appointment_date = ? where appointment_id = ?";
  db.query(sql, [appointmentDate, appointmentId], (err, results) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    const sqlEmail = "select email from patients where patient_id = ?";
    db.query(sqlEmail, [patientId], (error, patientResult) => {
      if (patientResult.length > 0) {
        const email = patientResult[0]["email"];
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Appointment Confirmation",
          text: `Dear Patient, your updated appointment is scheduled on ${appointmentDate}. Please contact if any queries.`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("error", error);
            res.send({
              message: "Appointment Scheduled Update Failed",
              status: 500,
            });
          } else {
            res.send({
              message: "Appointment Scheduled Updated Successfully",
              status: 200,
            });
          }
        });
      } else {
        res.send({ message: "Patient email not found", status: 404 });
      }
    });
  });
};

// Get All Appointments List
exports.getAllAppointment = async (req, res) => {
  const userId = req.user.id;
  const sql = "select * from appointments";
  const newsql = `select 
        ca.assignment_id, 
        ca.patient_id, 
        c.caregiver_id, 
        c.name as caregiver_name, 
        c.availability,
        p.name as patient_name,
        p.email,
        p.medical_record,
        a.notification_sent,
        a.appointment_id
    from 
        caregiver_assignments ca
    join 
        caregivers c
    on 
        ca.caregiver_id = c.caregiver_id
    join
        patients p
    on
        ca.patient_id = p.patient_id
    join
        appointments a
    on
      ca.caregiver_id = a.caregiver_id and p.patient_id = a.patient_id
    where
        c.user_id = ?`;
  db.query(newsql, [userId], (err, results) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.send(results);
  });
};
