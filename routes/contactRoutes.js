const express = require("express");
const router = express.Router();
const { createContact } = require("../controllers/contactController");
const upload = require("../middleware/uploadMiddleware");

router.post("/", upload.single("photo"), createContact);

module.exports = router;
