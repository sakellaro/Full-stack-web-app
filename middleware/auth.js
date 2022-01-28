const jwt = require("jsonwebtoken");
const config = require('../config/database');

const verifyToken = (req, res, next) => {
  const token = req.body;
  console.log(token);

  /*if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }*/
  return next();
};

module.exports = verifyToken;