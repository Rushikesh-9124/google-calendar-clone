import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { authenticate } from "../Utilities/utils.js";

const router = express.Router();

// Task Routes
router.get("/get-tasks", authenticate, getTasks);
router.post("/create-task", authenticate, createTask);
router.put("/update-task/:id", authenticate, updateTask);
router.delete("/delete-task/:id", authenticate, deleteTask);

export default router;
