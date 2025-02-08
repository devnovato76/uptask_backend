import type {Request, Response} from 'express';
import Task from '../models/Task.ts';



export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task.id);
      await Promise.allSettled([task.save(), req.project.save()]);
      res.send("Tarea Creada Correctamente");
      return;
    } catch (error) {
      res.status(500).json({
        error: "Hubo un error",
      });
      return;
    }
  };
  static getProjectTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({project: req.project.id}).populate('project')
        res.json(tasks)
        return;
    } catch (error) {
      res.status(500).json({
        error: "Hubo un error",
      });
      return;
    }
  };
  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await(
        await(await Task.findById(req.task.id)).populate({
          path: "completedBy.user",
          select: "id name email",
        })
      ).populate({
        path: "notes",
        populate: { path: "createBy", select: "id name email" },
      });
        res.json(task)
        return;
    } catch (error) {
        res.status(500).json({
          error: "Hubo un error",
        });
        return;
    }
  }
  static updateTask = async (req: Request, res: Response) => {
    try {
        if(req.task.project.toString() !== req.project.id){
            const error = new Error('Acción no válida')
            res.status(400).json({error: error.message})
            return
        }
        req.task.name = req.body.name
        req.task.description = req.body.description
        await req.task.save()
        res.send('Tarea Actualizada Correctamente')
        return;
    } catch (error) {
        res.status(500).json({
          error: "Hubo un error",
        });
        return;
    }
  }
  static deleteTask = async (req: Request, res: Response) => {
    try {
        req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())
        await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
        res.send('Tarea Eliminada Correctamente')
        return;
    } catch (error) {
        res.status(500).json({
          error: "Hubo un error",
        });
        return;
    }
  }

   static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status;
      const data = {
        user: req.user.id,
        status
      }
      req.task.completedBy.push(data);
      await req.task.save();
      res.send('Tarea Actulizada');
    } catch (error) {
       res.status(500).json({
         error: "Hubo un error"
       });
       return;
    }
   }
}
