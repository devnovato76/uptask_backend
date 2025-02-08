import type {Request, Response} from 'express';
import Project from '../models/Project.ts';
 
 export class ProjectController {

    static createProject = async(req: Request, res : Response) => {
        const project = new Project(req.body)
      // Asigna el creador del proyecto
      project.manager = req.user.id;
             
        try {
            await project.save()
            res.send('Proyecto Creado Correctamente')
            return;
        } catch (error) {
            res.status(500).json({
              error: "Hubo un error",
            });
        }
       
    }

    static getAllProjects = async(req: Request, res : Response) => {
       try {
        const projects = await Project.find({
          $or: [
                  { manager: {$in: req.user.id} },
                  {team: {$in: req.user.id}}
               ],
        })
        res.json(projects)
        return;
       } catch (error) {
        res.status(500).json({
          error: "Hubo un error",
        });
        return;
       } 
    }

    static getProjectById = async(req: Request, res : Response) => {
       try {
        const {id} = req.params;
        const project = await (await Project.findById(id)).populate('tasks')
        if(!project){
            const error = new Error('Proyecto no encontrado')
           res.status(404).json({
            error: error.message
           })
           return;
        }
        if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)){
            const error = new Error('Acción no válida')
            res.status(404).json({
                error: error.message
            })
            return;
        }
        res.json(project)
       } catch (error) {
        res.status(500).json({
          error: "Hubo un error",
        });
        return;
       } 
    }
    static updateProject = async(req: Request, res : Response) => {
        try {
            req.project.projectName = req.body.projectName
            req.project.clientName = req.body.clientName
            req.project.description = req.body.description
            await req.project.save()
            res.send('Proyecto Actualizado')
        } catch (error) {
            res.status(500).json({
              error: "Hubo un error",
            });
            return;
        } 
    }
    
    static deleteProject = async(req: Request, res : Response) => {
       
       try {
        await req.project.deleteOne()
        res.send("Proyecto Eliminado");
        return;
       } catch (error) {
        res.status(500).json({
          error: "Hubo un error",
        });
        return;
       } 
    }
}