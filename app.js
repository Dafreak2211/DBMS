const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var path = require("path");
var session = require("express-session");
const apiRouter = require("./route/api");
// body parser set up
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", "./route/template/");

app.use(
  session({
    secret: "ACCD",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
    // delete secure to have session
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true // enable set cookie
  })
);

app.use("/api", apiRouter);

let port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
