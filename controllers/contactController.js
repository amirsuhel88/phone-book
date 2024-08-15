const multer = require("multer");
const contacts = require("../contacts.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

exports.createContact = (req, res) => {
  const { name, phone, email } = req.body;
  const photo = req.file ? req.file.path : null;
  const newContact = { id: uuidv4(), name, phone, email, photo };
  contacts.push(newContact);
  fs.writeFileSync(
    "contacts.json",
    JSON.stringify(contacts, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Error writing to file" });
      }
    }
  );
  res.status(201).json({ message: "conatct created successfully" });
};
