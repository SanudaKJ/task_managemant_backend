import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController";

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
