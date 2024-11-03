// controllers/authController.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Register User
exports.register = async (req, res) => {
  const { email, password, first_name, last_name, address, city, role } =
    req.body;
  console.log("req", req.body);
  if (
    !email ||
    !password ||
    !first_name ||
    !last_name ||
    !address ||
    !city ||
    !role
  ) {
    return res.status(400).json({ msg: "Please fill all fields" });
  }

  try {
    // Check if the email or username is already in use
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (results.length > 0) {
          return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Save the user in the database
        db.query(
          "INSERT INTO users SET ?",
          {
            email,
            user_name: email,
            password: hashedPassword,
            first_name,
            last_name,
            full_name: `${first_name + " " + last_name}`,
            address,
            city,
            role,
          },
          (err, result) => {
            if (err) throw err;
            res.status(201).json({ msg: "User registered successfully" });
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
