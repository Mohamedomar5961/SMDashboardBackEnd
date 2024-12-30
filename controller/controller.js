const client = require("../DB/db");
const jwt = require("jsonwebtoken");

require("dotenv").config();

function users(req, res) {
  res.send("Hello world");
  client.query("SELECT * FROM userInfo", (err, result) => {
    if (!err) {
      console.log("userInfo : ", result.rows);
    } else {
      console.log(err.message);
    }
  });
}

function userLogin(req, res, next) {
  const { user_name, pass_word } = req.body;

  client.query(
    "SELECT id FROM userInfo WHERE username = $1 AND password = $2",
    [user_name, pass_word],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database Error" });
      }
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const token = jwt.sign(user, process.env.ACCESS_TOKEN);

        res.cookie("token", token);
        res.status(200).json({ message: "Welcome!" });
      } else {
        return res
          .status(404)
          .json({ message: "User not found in the database." });
      }

      next();
    }
  );
}

function userSignup(req, res) {
  const { username, email, password } = req.body;

  client.query(
    "SELECT * FROM userInfo WHERE username = $1 AND password = $2",
    [username, password],
    (err, result) => {
      if (err) {
        res.status(500).json({ message: "Database Error" });
      }

      if (result.rows.length > 0) {
        res.status(200).json({ message: "User is already in the database." });
      } else {
        client.query(
          `INSERT INTO userInfo (username,email,password) VALUES($1, $2, $3)`,
          [username, email, password]
        );
        res.status(202).json({ message: "Signup successful" });
      }
    }
  );
}

function dashBoard(req, res) {
  const { user_id } = res.user;

  client.query(
    "SELECT  id, username,email FROM userInfo WHERE id = $1",
    [user_id],
    (err, result) => {
      if (!err) {
        res.json(result);
      } else {
        console.log(err.message);
      }
    }
  );
}

function getUser(user_name) {
  client.query(
    "SELECT id, username, email FROM userInfo WHERE username = $1",
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

module.exports = { userLogin, userSignup, dashBoard, users, getUser };
