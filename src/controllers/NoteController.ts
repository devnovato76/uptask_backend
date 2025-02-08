import type {Request, Response} from 'express';
import Note,{type INote } from '../models/Note.ts';
import type { Types } from 'mongoose';

type NoteParams = {
    noteId: Types.ObjectId
}


export class NoteController {
    static createNote = async(req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body;
        const note = new Note()
        note.content = content
        note.createBy = req.user.id
        note.task = req.task.id

        req.task.notes.push(note.id)

        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Nota Creada Correctamente')
            return
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'});
            return
        }
    }

    static getTaskNotes = async(req: Request, res: Response) => {
       try {
          const notes = await  Note.find({task: req.task.id});
          res.json(notes)
          return
       } catch (error) {
        res.status(500).json({ error: "Hubo un error" });
        return;
       }
    }
      static deleteNote = async(req: Request<NoteParams>, res: Response) => {
            const {noteId} = req.params;
            const note = await Note.findById(noteId);

            if(!note){
                const error = new Error('Nota no encontrada');
                res.status(404).json({error: error.message});
                return;
            }
            if(note.createBy.toString() !== req.user.id.toString()){
                const error = new Error('Acción no Válida');
                res.status(401).json({error: error.message});
                return;
            }
            req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())
             try {
                await Promise.allSettled([req.task.save(), note.deleteOne()]);
                res.send('Nota Eliminada');
                return;
             } catch (error) {
                res.status(500).json({ error: "Hubo un error" });
                return;
             }
            }
      
} 