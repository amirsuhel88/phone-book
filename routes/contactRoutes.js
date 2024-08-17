const express = require("express");
const router = express.Router();
const {
  createContact,
  updateContact,
  getUserContacts,
  deleteContact,
  getContactById,
} = require("../controllers/contactController");
const upload = require("../middleware/uploadMiddleware");

const { authenticateToken } = require("../middleware/authMiddleware");
router.post("/", upload.single("photo"), authenticateToken, createContact);
router.put("/:id", upload.single("photo"), authenticateToken, updateContact);
router.get("/contacts", authenticateToken, getUserContacts);
router.delete("/:id", authenticateToken, deleteContact);
router.get("/:id", authenticateToken, getContactById);

module.exports = router;
