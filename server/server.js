const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authenRoute");
const equipmentRoutes = require("./routes/equipmentRoute");
const assignmentRoutes = require("./routes/assignmentRoute");
const userRoutes = require("./routes/userRoute");

const app = express();

app.use(cors());
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Equipment Management API Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});