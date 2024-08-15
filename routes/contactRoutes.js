const express = require("express");
const router = express.Router();
const {
  createContact,
  updateContact,
} = require("../controllers/contactController");
const upload = require("../middleware/uploadMiddleware");

router.post("/", upload.single("photo"), createContact);
router.put("/:id", upload.single("photo"), updateContact);

module.exports = router;
