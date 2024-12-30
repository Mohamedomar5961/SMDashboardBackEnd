const express = require("express");
const app = express();
const PORT = 3001;
const cors = require("cors");
const bodyParser = require("body-parser");
const { getUser } = require("./controller/controller");
const cookieParser = require("cookie-parser");

const routes = require("./routes/routes");

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
