const jwt = require("jsonwebtoken");

//user authenticatoion
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, "secret", (err, user) => {
    if (err) {
      console.log("toekn verification failed", err);
      return res.sendStatus(403); // Forbidden
    }

    req.user = user; // Attach user info to request object
    console.log("Authenticated user: ", req.user);
    next();
  });
};
