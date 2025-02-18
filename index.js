require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const Task = require("./models/Task");
const errorHandler = require("./middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect(process.env.URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

app.post("/tasks", async (req, res, next) => {
  try {
    const newTask = await Task.create({ title: req.body.title });
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

app.put("/tasks/:id", async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ error: "Task not found." });
    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
});

app.delete("/tasks/:id", async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found." });
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
