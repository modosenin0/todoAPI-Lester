import express from 'express';
import TaskController from '../controllers/TaskController.js';
import { authenticateApiKey } from '../middleware/auth.js';

const taskController = new TaskController();
const router = express.Router();

router.use(authenticateApiKey);

// Define routes
router.get('/', taskController.getTasks);
router.get('/:taskId', taskController.getTask);
router.post('/', taskController.createTask);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

export default router;
