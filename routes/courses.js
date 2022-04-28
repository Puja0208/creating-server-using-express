const express = require("express");
const router = express.Router();

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
  res.send(courses);
});

app.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === +req.params.id);
  if (!course) {
    //404 -object not found
    return res.status(404).send("Course with given id not found");
  }
  res.send(course);
});

app.post("/", (req, res) => {
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

app.put("/:id", (req, res) => {
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

app.delete("/:id", (req, res) => {
  const course = courses.find((c) => c.id === +req.params.id);
  if (!course) {
    //404 -object not found
    return res.status(404).send("Course with given id not found");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

module.exports = router;
