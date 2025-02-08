import type { Request, Response } from "express";
import User from "../models/User.ts";
import Project from "../models/Project.ts";
export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    
      const { email } = req.body;
      // Buscar el usuario
      const user = await User.findOne({ email }).select('id name email');
      if(!user){
        const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
      }  
     res.json(user);
     return; 
    };

    static getProjectTeam= async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id name email'
        });
        res.json(project.team);
        return;
    };

  static addMemberByEmail = async (req: Request, res: Response) => {
    const { id } = req.body;
    const user = await User.findById(id).select("id");
    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }
    if(req.project.team.some(team => team.toString() === user.id.toString())){
        const error = new Error("El usuario ya existe en el Proyecto");
        res.status(409).json({ error: error.message });
        return;
    }
    req.project.team.push(user.id);
    await req.project.save();
    res.send("Usuario agregado correctamente");
    return; 
    };

     static removeMemberByEmail = async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (
          !req.project.team.some(
            (team) => team.toString() === userId.toString()
          )
        ) {
          const error = new Error("El usuario no existe en el Proyecto");
          res.status(409).json({ error: error.message });
          return;
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId.toString());
        await req.project.save();
        res.send("Usuario eliminado correctamente");
        return; 
     };
};