const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  //No Token, Unauthorized
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //token invalid forbidden
    if (err) return res.sendStatus(403);
    req.user = user;

    next();
  });
}

module.exports = { authenticateToken };
