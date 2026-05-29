const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  addEquipment,
  getAllEquipment,
  updateEquipment,
  deleteEquipment
} = require("../controller/equipmentController");


// ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  addEquipment
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateEquipment
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteEquipment
);


// ALL LOGGED USERS
router.get(
  "/",
  authMiddleware,
  getAllEquipment
);

module.exports = router;