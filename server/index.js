const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const apiRouter = require("./Router/posts");
const usersRouter = require("./Router/users");

const app = express();
const port = process.env.PORT || 5000;
app.listen(port);

app.use(cors());
app.use(bodyParser.json());

app.use("/api", apiRouter);
app.use("/api", usersRouter);

console.log(`✔ Listening on : http://localhost:${port}`);
