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
  // const photo = req.file ? req.file.path : null;
  const photo = req.file.filename ?? null;
  // console.log(photo);
  const userId = req.user.id; //accessing user id from token
  const newContact = { id: uuidv4(), userId, name, phone, email, photo };
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
  const path = require("path");
  const contactsFilePath = path.join(__dirname, "../contacts.json");
  const { error } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { id } = req.params;
  const { name, phone, email } = req.body;
  const photo = req.file ? req.file.path : null;
  const userId = req.user.id; // Get the user ID from the token

  try {
    // Read and parse the contacts JSON file
    let contacts = JSON.parse(fs.readFileSync(contactsFilePath, "utf-8"));

    // Find the index of the contact to be updated
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === id && contact.userId === userId
    );

    if (contactIndex === -1) {
      return res.status(404).json({
        message:
          "Contact not found or you are not authorized to update this contact",
      });
    }

    // Update the contact
    contacts[contactIndex] = { id, userId, name, phone, email, photo };

    // Write the updated contacts array back to the JSON file
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));

    res.status(200).json({ message: "Contact updated successfully" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Error updating contact" });
  }
};

// Retrieve all contacts for a specific user
exports.getUserContacts = (req, res) => {
  const path = require("path");
  const contactsFilePath = path.join(__dirname, "../contacts.json");
  const userId = req.user.id;

  try {
    const contacts = JSON.parse(fs.readFileSync(contactsFilePath, "utf-8"));
    const userContacts = contacts.filter(
      (contact) => contact.userId === userId
    );

    res.status(200).json(userContacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving contacts" });
  }
};

// Delete a contact
exports.deleteContact = (req, res) => {
  const path = require("path");
  const contactsFilePath = path.join(__dirname, "../contacts.json");
  console.log("Request user:", req.user); // Debug line

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { id } = req.params;
  const userId = req.user.id; // Safely access req.user

  try {
    let contacts = JSON.parse(fs.readFileSync(contactsFilePath, "utf-8"));
    const contactIndex = contacts.findIndex(
      (contact) => contact.id === id && contact.userId === userId
    );

    if (contactIndex === -1) {
      return res.status(404).json({
        message:
          "Contact not found or you are not authorized to delete this contact",
      });
    }

    contacts.splice(contactIndex, 1); // Remove the contact
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting contact" });
  }
};

// Retrieve a specific contact by ID
exports.getContactById = (req, res) => {
  const path = require("path");
  const contactsFilePath = path.join(__dirname, "../contacts.json");

  const { id } = req.params;
  const userId = req.user.id;

  try {
    const contacts = JSON.parse(fs.readFileSync(contactsFilePath, "utf-8"));
    const contact = contacts.find(
      (contact) => contact.id === id && contact.userId === userId
    );

    if (!contact) {
      return res.status(404).json({
        message:
          "Contact not found or you are not authorized to view this contact get contact by id",
      });
    }

    res.status(200).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving contact" });
  }
};
