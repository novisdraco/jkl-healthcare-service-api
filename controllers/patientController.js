const db = require("../config/db");
const dotenv = require("dotenv");

dotenv.config();

// Create Patient
exports.createPatient = async (req, res) => {
  const { userId, name, email, address, medicalRecord } = req.body;
  if (!userId || !name || !email || !address || !medicalRecord) {
    return res.status(400).json({ error: "required fileds are empty" });
  }
  const sql =
    "insert into patients (user_id, name, email, address, medical_record) values (?,?,?,?,?)";
  db.query(
    sql,
    [userId, name, email, address, medicalRecord],
    (err, result) => {
      if (err) {
        console.error("error", err);
        throw err;
      }
      res.json({ message: "Patient Added", status: 200 });
    }
  );
};

// Update Patient
exports.updatePatient = async (req, res) => {
  const { patientId, name, email, address, medicalRecord, updatedAt } =
    req.body;
  if (!patientId) {
    return res.status(400).json({ error: "patientId Required" });
  }

  let fileds = [];
  let params = [];
  if (name !== undefined) {
    fileds.push("name = ?");
    params.push(name);
  }
  if (email !== undefined) {
    fileds.push("email = ?");
    params.push(email);
  }
  if (address !== undefined) {
    fileds.push("address = ?");
    params.push(address);
  }
  if (medicalRecord !== undefined) {
    fileds.push("medical_record = ?");
    params.push(medicalRecord);
  }
  if (updatedAt !== undefined) {
    fileds.push("update_at = ?");
    params.push(updatedAt);
  }

  if (fileds.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  params.push(patientId);

  const sql = `update patients set ${fileds.join(",")} where patient_id = ?`;
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.json({ message: "Patient Updated", status: 200 });
  });
};

// Delete Patient
exports.deletePatient = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "id Required" });
  }
  const sql = "delete from patients where patient_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.json({ message: "Patient Deleted", status: 200 });
  });
};

// Get All Patients Detail For Logged In Patient
exports.getPatientDetails = async (req, res) => {
  const userId = req.user.id;
  const { filters } = req.body;
  let sql = `select * from patients where user_id = ?`;
  const params = [userId];
  if (filters) {
    sql += ` and name like ?`;
    params.push(`%${filters}%`);
  }
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.json(results);
  });
};

// Get All Patient Details For Caregiver
exports.getAllPatientDetails = async (req, res) => {
  const { filters } = req.body;
  let sql = "select * form patients";
  const params = [];
  if (filters) {
    sql += " where name like ?";
    params.push(`%${filters}%`);
  }
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("error", err);
      throw err;
    }
    res.json(results);
  });
};
