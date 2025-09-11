const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const routesApiVer1 = require("./api/v1/routes/index-route");
const database = require("./config/database");
database.connect();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
const port = process.env.PORT;
routesApiVer1(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
