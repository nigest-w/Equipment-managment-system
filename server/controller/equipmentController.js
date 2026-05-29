const pool = require("../config/database");

// ADD EQUIPMENT
exports.addEquipment = async (req, res) => {
  try {
    const { name, type, serial_number } = req.body;

    const newItem = await pool.query(
      "INSERT INTO equipment (name, type, serial_number) VALUES ($1, $2, $3) RETURNING *",
      [name, type, serial_number]
    );

    res.json(newItem.rows[0]);

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};


// GET ALL EQUIPMENT
exports.getAllEquipment = async (req, res) => {
  try {
    const items = await pool.query(
      "SELECT * FROM equipment ORDER BY id DESC"
    );

    res.json(items.rows);

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};


// UPDATE EQUIPMENT
exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, serial_number, status } = req.body;

    const updated = await pool.query(
      "UPDATE equipment SET name=$1, type=$2, serial_number=$3, status=$4 WHERE id=$5 RETURNING *",
      [name, type, serial_number, status, id]
    );

    res.json(updated.rows[0]);

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};


// DELETE EQUIPMENT
exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM equipment WHERE id=$1", [id]);

    res.json("Equipment deleted successfully");

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};