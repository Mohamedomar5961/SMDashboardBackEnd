const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

client.connect();

const tester1 = "baby";
const tester2 = "women";

client.query("DELETE FROM information");

client.query("SELECT * FROM information", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err.message);
  }
  client.end;
});
