import { Request, Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middlewares/authMiddleware";
import Joi from "joi";

const taskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid("pending", "completed").optional(),
});

export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const task = await Task.create({ ...req.body, user: req.user.id });
  res.status(201).json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    // Update only provided fields
    task.title = title ?? task.title;
    task.description = description ?? task.description;

    // Convert status string to boolean
    if (status !== undefined) {
      task.completed = status === "completed";
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (task.user.toString() !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};
