const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

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
    res.status(404).send("Course with given id not found");
  }
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  //input validation
  const schema = {
    name: Joi.string().min(3).required(),
  };
  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
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
//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
