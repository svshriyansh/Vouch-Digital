/**
 * @author Shriyansh Vishwakarma <shriyanshsv@outlook.com>
 */
require("dotenv").config();
const jwt = require("jsonwebToken");

// function to check user is authenticated or not
async function authenticationToken(req, res, next) {
  const token = req.headers["auth_token"];
  if (token == null) {
    return res.send("Token not send");
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.send("Token is no longer valid");
    req.user = user;
    next();
  });
}

module.exports = authenticationToken;
