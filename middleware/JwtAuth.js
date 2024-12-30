const jwt = require("jsonwebtoken");

function jwtAuth(req, res, next) {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN);
    res.user = user;
    next();
  } catch (err) {
    console.log("CLEAR TOKE:::");
    res.clearCookie("token");
  }
}

module.exports = jwtAuth;
