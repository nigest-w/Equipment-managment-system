const pool = require("../config/database");


// ASSIGN EQUIPMENT TO USER
exports.assignEquipment = async (req, res) => {
  try {
    const { equipment_id, user_id } = req.body;

    // 1. Check if equipment is available
    const equipment = await pool.query(
      "SELECT * FROM equipment WHERE id = $1",
      [equipment_id]
    );

    if (equipment.rows.length === 0) {
      return res.status(404).json("Equipment not found");
    }

    if (equipment.rows[0].status !== "available") {
      return res.status(400).json("Equipment not available");
    }

    // 2. Create assignment
    const assignment = await pool.query(
      "INSERT INTO assignments (equipment_id, user_id) VALUES ($1, $2) RETURNING *",
      [equipment_id, user_id]
    );

    // 3. Update equipment status
    await pool.query(
      "UPDATE equipment SET status = 'assigned' WHERE id = $1",
      [equipment_id]
    );

    res.json(assignment.rows[0]);

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};


// GET ALL ASSIGNMENTS
exports.getAssignments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, e.name AS equipment, u.name AS user, a.assigned_date, a.returned
       FROM assignments a
       JOIN equipment e ON a.equipment_id = e.id
       JOIN users u ON a.user_id = u.id
       ORDER BY a.id DESC`
    );

    res.json(result.rows);

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};


// RETURN EQUIPMENT
exports.returnEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get assignment
    const assignment = await pool.query(
      "SELECT * FROM assignments WHERE id = $1",
      [id]
    );

    if (assignment.rows.length === 0) {
      return res.status(404).json("Assignment not found");
    }

    const equipment_id = assignment.rows[0].equipment_id;

    // 2. Update assignment
    await pool.query(
      "UPDATE assignments SET returned = TRUE WHERE id = $1",
      [id]
    );

    // 3. Update equipment status
    await pool.query(
      "UPDATE equipment SET status = 'available' WHERE id = $1",
      [equipment_id]
    );

    res.json("Equipment returned successfully");

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};