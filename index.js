const debug = require("debug")("app:startup");

const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./middleware/logger");
const courses = require("./routes/courses");
const home = require("./routes/home");
const auth = require("./authenticator");
const express = require("express");
const func = require("joi/lib/types/func");
const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); //;put all template sin views foldre

// console.log(`NODE_ENV is ${process.env.NODE_ENV}`);
// console.log(`SPP: ${app.get("env")}`);
app.use(express.json()); //middle ware to populate request.body
app.use(express.urlencoded({ extended: true })); //built in middleware to parse incoming requests with url encoded payloads eg:key=value&key1=value
app.use(express.static("public")); //serves static content
//put al static asstest like images etc in public folder

app.use(helmet()); //middleware to set multiple http headers
app.use("/api/courses", courses); //use courses router for any api that starts with /api/courses
app.use("/", home);
//Configurat"ion
console.log("Application name:" + config.get("name"));
console.log("Mail Server name:" + config.get("mail.host"));
console.log("Mail Password:" + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny")); //logs all requests sent to server
  debug("morgan enabled");
}

//Db work

//middleware for logging
app.use(logger);
//middleware for logging
app.use(auth);

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
