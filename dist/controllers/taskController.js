"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const joi_1 = __importDefault(require("joi"));
const taskSchema = joi_1.default.object({
    title: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    status: joi_1.default.string().valid("pending", "completed").optional(),
});
const getTasks = async (req, res) => {
    const tasks = await Task_1.default.find({ user: req.user.id });
    res.json(tasks);
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    const { error } = taskSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.message });
    const task = await Task_1.default.create({ ...req.body, user: req.user.id });
    res.status(201).json(task);
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await Task_1.default.findById(req.params.id);
        if (!task)
            return res.status(404).json({ message: "Task not found" });
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
    }
    catch (error) {
        console.error("Update Task Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const task = await Task_1.default.findById(req.params.id);
    if (!task)
        return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });
    await task.deleteOne();
    res.json({ message: "Task deleted" });
};
exports.deleteTask = deleteTask;
