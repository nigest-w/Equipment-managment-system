const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");


const {
  assignEquipment,
  getAssignments,
  returnEquipment
} = require("../controller/assignmentController");
const adminMiddleware = require("../middleware/adminMiddleware");


// ASSIGN
router.post("/", authMiddleware, assignEquipment);

// GET ALL
router.get("/", authMiddleware, getAssignments);

// RETURN
router.put("/return/:id", authMiddleware,adminMiddleware, returnEquipment);
router.put(
  "/return/:id",
authMiddleware,
  async (req, res) => {

    try {

      const assignmentId = req.params.id;

      // FIND ASSIGNMENT
      const assignmentResult = await pool.query(
        "SELECT * FROM assignments WHERE id = $1",
        [assignmentId]
      );

      if (assignmentResult.rows.length === 0) {
        return res
          .status(404)
          .json({
            message: "Assignment not found"
          });
      }

      const assignment =
        assignmentResult.rows[0];

      // MARK RETURNED
      await pool.query(
        `
        UPDATE assignments
        SET returned = true
        WHERE id = $1
        `,
        [assignmentId]
      );

      // UPDATE EQUIPMENT STATUS
      await pool.query(
        `
        UPDATE equipment
        SET status = 'available'
        WHERE id = $1
        `,
        [assignment.equipment_id]
      );

      res.json({
        message:
          "Equipment returned successfully"
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }
  }
);

module.exports = router;