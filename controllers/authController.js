const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const users = require("../users.json");
const { userSchema, loginSchema } = require("../middleware/validation");

//authentication for sighn up.
exports.signup = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    username,
    email,
    password: hashedPassword,
  };
  users.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.status(201).json({
    message: "User is successfully registered",
  });
};

//authenticatoin for login
exports.login = async (req, res) => {
  const { error } = this.loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "invalid credentials" });

  const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
  res.json({ token });
};
