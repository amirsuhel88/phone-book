const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use(express.static(path.join(__dirname, "public")));
// app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
