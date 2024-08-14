const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
app.use(express.json());

app.use("/api/auth", authRoutes);
// app.use("/api/contacts", conactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
