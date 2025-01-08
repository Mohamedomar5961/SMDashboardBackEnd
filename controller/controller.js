const client = require("../DB/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { password } = require("pg/lib/defaults");

require("dotenv").config();

function users(req, res) {
  res.send("Hello world");
  client.query("SELECT * FROM userTable", (err, result) => {
    if (!err) {
      console.log("userTable : ", result.rows);
    } else {
      console.log(err.message);
    }
  });
}
async function crypt(password){
  const salt = await bcrypt.genSalt(10);
  const cryptedPassword = await bcrypt.hash(password, salt);
  return cryptedPassword;
}
async function verifyPassword(password, cryptedPassword){
  const isMatch = await bcrypt.compare(password,cryptedPassword);
  return isMatch;
}

function createTable() {
  client.query(
    `CREATE TABLE userTable (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    profilePicture VARCHAR(255),
    bio VARCHAR(255),
    signupDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastLogin TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accountStatus BOOLEAN DEFAULT TRUE,
    themePreference VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE)`
  );
}

function userLogin(req, res, next) {
  const { user_name, pass_word } = req.body;

  client.query(
    "SELECT id FROM userTable WHERE username = $1 AND password = $2",
    [user_name, pass_word],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database Error" });
      }
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);

        res.status(200).json({ accessToken: accessToken});
      } else {
        return res
          .status(404)
          .json({ message: "User not found in the database." });
      }

      next();
    }
  );
}

async function userSignup(req, res) {
  const { username, email, password, fullname} = req.body;
  const cryptedPassword = await crypt(password);

  client.query(
    "SELECT * FROM userTable WHERE username = $1 AND password = $2 AND email = $3 ",
    [username, cryptedPassword, email,],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: "Database Error" });
      }

      if (result.rows.length > 0) {
        res.status(200).json({ message: "User is already in the database." });
      } else {
        client.query(
          `INSERT INTO userTable (username,email,password,fullname) VALUES($1, $2, $3, $4)`,
          [username, email, cryptedPassword, fullname]
        );
        res.status(202).json({ message: "Signup successful" });
      }
    }
  );
}

function dashBoard(req, res) {
  const user_id = req.user;
}

function deleteUser(){
  client.query("DELETE FROM userTable WHERE id = 1");
};

function getUser(user_name) {
  client.query(
    "SELECT id, username, email FROM userTable WHERE username = $1",
    [user_name],
    (err, result) => {
      if (!err) {
        return result.rows[0];
      } else {
        return { message: "Database ERROR" };
      }
    }
  );
}

module.exports = { userLogin, userSignup, dashBoard, users, getUser , createTable, deleteUser};
