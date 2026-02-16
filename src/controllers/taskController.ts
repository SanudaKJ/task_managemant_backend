import { Request, Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middlewares/authMiddleware";
import Joi from "joi";

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional(),
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
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (task.user.toString() !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  const { error } = taskSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  Object.assign(task, req.body);
  await task.save();
  res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (task.user.toString() !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};
