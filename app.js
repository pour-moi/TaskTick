const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.Mongo_Uri);

const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

const taskSchema = {
  name: String,
};

const Task = mongoose.model("Task", taskSchema);

const task1 = new Task({
  name: "First",
});

const task2 = new Task({
  name: "Second",
});

const task3 = new Task({
  name: "Third",
});

const defaultTask = [task1, task2, task3];

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

  Task.find({}).then((foundTask) => {
    if (foundTask.length === 0) {
      Task.insertMany(defaultTask);
    } else {
      res.render("index", {
        Date: currentDate.toLocaleString("en-US", options),
        newTask: foundTask,
        week_days: week_day,
        Dates: dates,
      });
    }
  });
});

app.post("/", function (req, res) {
  let addedTask = req.body.addedTask;

  const task = new Task({
    name: addedTask,
  });
  task.save();

  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const taskName = req.body.delete_task_name;

  Task.findByIdAndDelete(taskName).then(() => {
    console.log("Successfully Deleted");
  });

  res.redirect("/");
});

app.listen(PORT, function () {
  console.log("Server listening on port 3000");
});
