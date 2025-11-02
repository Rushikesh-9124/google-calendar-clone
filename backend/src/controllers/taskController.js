import Task from "../models/Task.js";

// ✅ Get all tasks created by the logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// ✅ Create a new task for the logged-in user
export const createTask = async (req, res) => {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  try {
    const newTask = new Task({
      ...req.body,
      createdBy: userId,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: "Error creating task", error });
  }
};

// ✅ Update a task (only if created by the logged-in user)
export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating task", error });
  }
};

// ✅ Delete a task (only if created by the logged-in user)
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: "Error deleting task", error });
  }
};
