// controllers/authController.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Register User
exports.register = async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;

  if (!email || !password || !first_name || !last_name || !role) {
    return res.status(400).json({ msg: "Please fill all fields" });
  }

  try {
    // Check if the email is already in use
    db.query(
      "select * from users where email = ?",
      [email],
      async (error, results) => {
        if (results.length > 0) {
          return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Save the user in the database
        db.query(
          "insert into users set ?",
          {
            email,
            user_name: email,
            password: hashedPassword,
            first_name,
            last_name,
            full_name: `${first_name + " " + last_name}`,
            role,
          },
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ msg: "Server error" });
            }

            // User successfully registered
            const userId = result.insertId; // Get the inserted user ID

            // Check if the role_id is 2 and create a caregiver
            if (role === 2) {
              const caregiverName = `${first_name} ${last_name}`;
              const caregiverSql =
                "insert into caregivers (user_id, name, availability) values (?, ?, true)";
              db.query(
                caregiverSql,
                [userId, caregiverName],
                (caregiverErr) => {
                  if (caregiverErr) {
                    console.error("Error creating caregiver:", caregiverErr);
                    return res.status(500).json({
                      msg: "User registered but failed to create caregiver",
                    });
                  }

                  return res.status(201).json({
                    msg: "User and caregiver registered successfully",
                  });
                }
              );
            } else {
              return res
                .status(201)
                .json({ msg: "User registered successfully" });
            }
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please fill all fields" });
  }

  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (results.length === 0) {
          console.warn(`Login failed: email not found - ${email}`);
          return res.status(401).json({ msg: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(
          password,
          results[0].password
        );
        if (!validPassword) {
          console.warn(`Login failed: incorrect password - ${email}`);
          return res.status(401).json({ msg: "Invalid credentials" });
        }

        // Generate a token
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        res.json({ token, msg: "Logged in successfully" });
      }
    );
  } catch (error) {
    console.error("Server error during login:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
