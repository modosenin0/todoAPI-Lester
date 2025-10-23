import Task from '../models/Task.js';

export default class TaskController {
  constructor() {
    this.tasks = new Map(); 
  }

  generateId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // GET tasks
  getTasks = (req, res) => {
    try {
      let tasks = Array.from(this.tasks.values());

      if (req.query.status) {
        tasks = tasks.filter(task => task.status === req.query.status);
      }

      if (req.query.priority) {
        tasks = tasks.filter(task => task.priority === req.query.priority);
      }

      if (req.query.search) {
        const searchLower = req.query.search.toLowerCase();
        tasks = tasks.filter(task => 
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
        );
      }
      res.json({ count: tasks.length, tasks });
    } catch (error) {
      console.error('Error in getTasks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET specific task
  getTask = (req, res) => {
    try {
      const task = this.tasks.get(req.params.taskId);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      console.error('Error in getTask:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST Create a task
  createTask = (req, res) => {
    try {
      const { title, description, status, priority } = req.body;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
      }

      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
      }

      const validPriorities = ['low', 'medium', 'high'];
      if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ error: `Priority must be one of: ${validPriorities.join(', ')}` });
      }

      const task = new Task(
        this.generateId(),
        title.trim(),
        description?.trim() || '',
        status || 'pending',
        priority || 'medium'
      );

      this.tasks.set(task.id, task);
      res.status(201).json(task);
    } catch (error) {
      console.error('Error in createTask:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT Update task
  updateTask = (req, res) => {
    try {
      const task = this.tasks.get(req.params.taskId);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const { title, description, status, priority } = req.body;

      if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length === 0) {
          return res.status(400).json({ error: 'Title must be a non-empty string' });
        }
        task.title = title.trim();
      }

      if (description !== undefined && typeof description === 'string') {
        task.description = description.trim();
      }

      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (status !== undefined) {
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        }
        task.status = status;
      }

      const validPriorities = ['low', 'medium', 'high'];
      if (priority !== undefined) {
        if (!validPriorities.includes(priority)) {
          return res.status(400).json({ error: `Priority must be one of: ${validPriorities.join(', ')}` });
        }
        task.priority = priority;
      }

      task.updatedAt = new Date().toISOString();
      res.json(task);
    } catch (error) {
      console.error('Error in updateTask:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE task
  deleteTask = (req, res) => {
    try {
      const deleted = this.tasks.delete(req.params.taskId);

      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error in deleteTask:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
