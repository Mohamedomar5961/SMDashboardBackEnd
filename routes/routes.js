const express = require("express");
const router = express.Router();

const jwtAuth = require("../middleware/JwtAuth");

const {
  users,
  userLogin,
  userSignup,
  dashBoard,
  createTable,
  deleteUser
} = require("../controller/controller");
router.route("/").get(users);
router.route("/login").post(userLogin);
router.route("/signup").post(userSignup);
router.route("/dashboard").get(jwtAuth, dashBoard);
router.route("/createTable").get(createTable)
router.route("/deleteUser").get(deleteUser)
module.exports = router;
