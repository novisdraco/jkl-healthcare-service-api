const express = require("express");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");
const cors = require("cors");

const app = express();
app.use(cors());
app.options("*", cors());

// middleware implementation
app.use(express.json());

// routes
app.use("/", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
