const express = require("express");
const router = express.Router();

const jwtAuth = require("../middleware/JwtAuth");

const {
  users,
  userLogin,
  userSignup,
  dashBoard,
} = require("../controller/controller");
router.route("/").get(users);
router.route("/login").post(userLogin);
router.route("/signup").post(userSignup);
router.route("/dashboard").get(jwtAuth, dashBoard);

module.exports = router;
