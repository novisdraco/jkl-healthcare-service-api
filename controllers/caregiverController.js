const db = require("../config/db");
const dotenv = require("dotenv");

dotenv.config();

// Update Caregiver
exports.updateCareGiver = async (req, res) => {
  const { caregiverId, name, availability } = req.body;
  if (!caregiverId) {
    return res.status(400).json({ error: "caregiverId Required" });
  }

  let fileds = [];
  let params = [];
  if (name !== undefined) {
    fileds.push("name = ?");
    params.push(name);
  }
  if (availability !== undefined) {
    fileds.push("availability = ?");
    params.push(availability);
  }
  if (fileds.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  params.push(caregiverId);

  const sql = `update caregivers set ${fileds.join(
    ","
  )} where caregiver_id = ?`;
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.json({ message: "Caregiver Updated", status: 200 });
  });
};

// Assign Caregiver To Patient
exports.assignCaregiver = async (req, res) => {
  const { patientId, caregiverId } = req.body;
  const sql =
    "insert into caregiver_assignments (patient_id, caregiver_id) values (?, ?)";
  db.query(sql, [patientId, caregiverId], (err, results) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.send({ message: "Caregiver Assigned", status: 200 });
  });
};

// Unassign Caregiver To Patient
exports.unassignCaregiver = async (req, res) => {
  const { assignmentId } = req.body;
  const sql = "delete from caregiver_assignments where assignment_id = ?";
  db.query(sql, [assignmentId], (err, results) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.send({ message: "Caregiver Unassigned", status: 200 });
  });
};

// Get Caregiver
exports.getAllCaregiver = async (req, res) => {
  const userId = req.user.id;
  const sql = "select * from caregivers where user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.json(results);
  });
};

exports.getUnassignedList = async (req, res) => {
  const userId = req.user.id;
  const sql = `select 
                c.caregiver_id, 
                c.name AS caregiver_name, 
                c.availability,
                p.name as patient_name,
                p.patient_id,
                p.email,
                p.medical_record
              from 
                caregivers c
              cross join 
                patients p
              left join 
                caregiver_assignments ca
              on 
                p.patient_id = ca.patient_id
              where 
                ca.caregiver_id IS NULL and c.availability = 1 and c.user_id = ?;`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.json(results);
  });
};

// Get Caregiver Availability & Assignments With Patient Name
exports.getAssignedList = async (req, res) => {
  const caregiverId = req.user.id;
  const sql = `select 
        ca.assignment_id, 
        ca.patient_id, 
        c.caregiver_id, 
        c.name as caregiver_name, 
        c.availability,
        p.name as patient_name,
        p.email,
        p.medical_record
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
    where
        c.user_id = ?`;
  db.query(sql, [caregiverId], (err, results) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.json(results);
  });
};
