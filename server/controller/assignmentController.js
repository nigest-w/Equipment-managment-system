const pool = require("../config/database");


// ASSIGN EQUIPMENT TO USER
exports.assignEquipment = async (req, res) => {
  try {
    const { equipment_id, user_id } = req.body;

    // 1. Check equipment
    const equipmentResult = await pool.query(
      "SELECT * FROM equipment WHERE id = $1",
      [equipment_id]
    );

    if (equipmentResult.rows.length === 0) {
      return res.status(404).json("Equipment not found");
    }

    const equipment = equipmentResult.rows[0];

    if (equipment.status !== "available") {
      return res.status(400).json("Equipment not available");
    }

    // 2. Prevent duplicate assignment
    const existingResult = await pool.query(
      "SELECT * FROM assignments WHERE equipment_id = $1 AND returned = false",
      [equipment_id]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        message: "Equipment already assigned"
      });
    }

    // 3. Get serial number
    const serial_number = equipment.serial_number;

    // 4. Insert assignment
    const assignmentResult = await pool.query(
      `INSERT INTO assignments (equipment_id, user_id, serial_number)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [equipment_id, user_id, serial_number]
    );

    // 5. Update equipment status
    await pool.query(
      "UPDATE equipment SET status = 'assigned' WHERE id = $1",
      [equipment_id]
    );

    res.json(assignmentResult.rows[0]);

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};


// GET ALL ASSIGNMENTS
exports.getAssignments = async (req, res) => {
  try {

    // EMPLOYEE: see only their assignments
    if (req.user.role === "employee") {

      const result = await pool.query(
        `
        SELECT
    a.id,
    e.name AS equipment,
    e.serial_number,
    u.name AS user,
    a.assigned_date,
    a.returned
  FROM assignments a
  JOIN equipment e ON a.equipment_id = e.id
  JOIN users u ON a.user_id = u.id
  WHERE a.user_id = $1
  ORDER BY a.id DESC
        `,
        [req.user.id]
      );

      return res.json(result.rows);
    }

    // ADMIN: see all assignments
    const result = await pool.query(
      `
      SELECT
        a.id,
        e.name AS equipment,
        e.serial_number,
        u.name AS user,
        a.assigned_date,
        a.returned
      FROM assignments a
      JOIN equipment e ON a.equipment_id = e.id
      JOIN users u ON a.user_id = u.id
      ORDER BY a.id DESC
      `
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