const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let tasks = ["First", "Second", "Third"];

app.get("/", function (req, res) {
  let date = new Date();
  let currentDate = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let dates = [];

  for (let i = 0; i < 6; i++) {
    var week_day = date.toLocaleString("en-US", { weekday: "short" });
    var date_num = date.toLocaleString("en-US", {
      day: "numeric",
    });
    dates.push({ week_day, date_num });
    date.setDate(date.getDate() + 1);
  }

  res.render("index", {
    Date: currentDate.toLocaleString("en-US", options),
    newTask: tasks,
    week_days: week_day,
    Dates: dates,
  });
});

app.post("/", function (req, res) {
  let addedTask = req.body.addedTask;

  tasks.push(addedTask);
  res.redirect("/");
});

app.listen(PORT, function () {
  console.log("Server listening on port 3000");
});
