const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./logger");
const auth = require("./authenticator");
const express = require("express");
const func = require("joi/lib/types/func");
const app = express();

// console.log(`NODE_ENV is ${process.env.NODE_ENV}`);
// console.log(`SPP: ${app.get("env")}`);
app.use(express.json()); //middle ware to populate request.body
app.use(express.urlencoded({ extended: true })); //built in middleware to parse incoming requests with url encoded payloads eg:key=value&key1=value
app.use(express.static("public")); //serves static content
//put al static asstest like images etc in public folder

app.use(helmet()); //middleware to set multiple http headers

//Configurat"ion
console.log("Application name:" + config.get("name"));
console.log("Mail Server name:" + config.get("mail.host"));

if (app.get("env") === "development") {
  app.use(morgan("tiny")); //logs all requests sent to server
  console.log("morgan enabled");
}

//middleware for logging
app.use(logger);
//middleware for logging
app.use(auth);

const courses = [
  {
    id: 1,
    name: "course1",
  },
  {
    id: 2,
    name: "course2",
  },
  {
    id: 3,
    name: "course3",
  },
];

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === +req.params.id);
  if (!course) {
    //404 -object not found
    return res.status(404).send("Course with given id not found");
  }
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  //input validation

  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // if (!req.body.name || req.body.name.length < 3) {
  //   res.status(400).send("Name is required & should be minimum 4 characters");
  //   return;
  // }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === +req.params.id);
  if (!course) {
    //404 -object not found
    return res.status(404).send("Course with given id not found");
  }

  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  course.name = req.body.name;
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

app.delete("/api/course/:id", (req, res) => {
  const course = courses.find((c) => c.id === +req.params.id);
  if (!course) {
    //404 -object not found
    return res.status(404).send("Course with given id not found");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});
//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
