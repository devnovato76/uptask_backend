import type { Request, Response, NextFunction } from "express";
import Task, { type ITask } from "../models/Task.ts";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}
export async function taskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      const error = new Error("Tarea no encontrada");
      res.status(404).json({
        error: error.message,
      });
      return;
    }
    req.task = task;
    next();
    return;
  } catch (error) {
    res.status(500).json({
      error: "Hubo un error",
    });
    return;
  }
}

export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  
        if (req.task.project.toString() !== req.project.id.toString()) {
          const error = new Error("Acción no válida");
          res.status(400).json({ error: error.message });
          return;
        }
        next()
        return;
        
}

export function hasAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  
        if (req.user.id.toString() !== req.project.manager.toString()) {
          const error = new Error("Acción no válida");
          res.status(400).json({ error: error.message });
          return;
        }
        next()
        return;
        
}
