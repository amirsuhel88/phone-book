const multer = require("multer");
const contacts = require("../contacts.json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { contactSchema } = require("../middleware/validation");

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

//create a new contact
exports.createContact = (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

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

//update a existing contact
exports.updateContact = (req, res) => {
  const error = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { id } = req.params;
  const { name, phone, email } = req.body;
  const photo = req.file ? req.file.path : null;

  const contactIndex = contacts.findIndex((c = c.id === id));
  if (contactIndex === -1)
    return res.status(404).json({ message: "contact not found" });

  contacts[contactIndex] = { id, name, phone, email, photo };
  fs.writeFileSync("contacts.json", JSON.stringify(contacts));
  res.status(200).json({ message: "contact updated successfully" });
};
