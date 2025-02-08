import {Router} from 'express';
import {body, param} from 'express-validator';
import { ProjectController } from '../controllers/ProjectControllers.ts';
import { handleInputErrors } from '../middleware/validation.ts';
import { TaskController } from '../controllers/TaskController.ts';
import { projectExists } from '../middleware/project.ts';
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task.ts';
import { authenticate } from '../middleware/auth.ts';
import { TeamMemberController } from '../controllers/TeamController.ts';
import { NoteController } from '../controllers/NoteController.ts';

const router = Router();

router.use(authenticate);

router.post('/',
    body('projectName')
    .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName')
    .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description')
    .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
    handleInputErrors,
    ProjectController.createProject)

router.get("/", ProjectController.getAllProjects);

router.get('/:id', 
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectById)

router.param("projectId", projectExists);

router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El Nombre del Proyecto es Obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El Nombre del Cliente es Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción del Proyecto es Obligatoria"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProject
);


/* ---- Rutas de las Tareas ------ */



router.post(
  "/:projectId/tasks",
  hasAuthorization,
  body("name")
    .notEmpty()
    .withMessage("El Nombre de la Tarea Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción de la Tarea es Obligatoria"),
  handleInputErrors,
  TaskController.createTask
);

router.get(
  "/:projectId/tasks",
  TaskController.getProjectTasks
);

router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);
router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("name").notEmpty().withMessage("El Nombre de la Tarea Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción de la Tarea es Obligatoria"),
  handleInputErrors,
  TaskController.updateTask
);
router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  TaskController.deleteTask
);

/* ---- Rutas de los Estados ------ */
router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no válido"),
  body("status").notEmpty().withMessage("El estado es Obligatorio"),
  handleInputErrors,
  TaskController.updateStatus
);

/* ---- Rutas por Teams ------ */

router.post('/:projectId/team/find',
   body('email').isEmail().toLowerCase().withMessage('E-mail no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
   );

router.get('/:projectId/team', 
       TeamMemberController.getProjectTeam
   );
   
router.post('/:projectId/team', 
   body('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.addMemberByEmail
);


router.delete('/:projectId/team/:userId', 
   param('userId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.removeMemberByEmail
);

/**   Rutas para  las Notas **/

router.post('/:projectId/tasks/:taskId/notes',
  body('content')
    .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
  NoteController.getTaskNotes

)
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
  param('noteId').isMongoId().withMessage('ID No Válido'),
  handleInputErrors,
  NoteController.deleteNote

)


export default router;