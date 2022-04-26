const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

app.get("/courses", (req, res) => {
  console.log("hit");
  res.send[(1, 2, 3)];
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
