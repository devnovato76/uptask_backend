"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var ProjectControllers_ts_1 = require("../controllers/ProjectControllers.ts");
var validation_ts_1 = require("../middleware/validation.ts");
var TaskController_ts_1 = require("../controllers/TaskController.ts");
var project_ts_1 = require("../middleware/project.ts");
var task_ts_1 = require("../middleware/task.ts");
var auth_ts_1 = require("../middleware/auth.ts");
var TeamController_ts_1 = require("../controllers/TeamController.ts");
var NoteController_ts_1 = require("../controllers/NoteController.ts");
var router = (0, express_1.Router)();
router.use(auth_ts_1.authenticate);
router.post('/', (0, express_validator_1.body)('projectName')
    .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'), (0, express_validator_1.body)('clientName')
    .notEmpty().withMessage('El Nombre del Cliente es Obligatorio'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'), validation_ts_1.handleInputErrors, ProjectControllers_ts_1.ProjectController.createProject);
router.get("/", ProjectControllers_ts_1.ProjectController.getAllProjects);
router.get('/:id', (0, express_validator_1.param)('id').isMongoId().withMessage('ID no válido'), validation_ts_1.handleInputErrors, ProjectControllers_ts_1.ProjectController.getProjectById);
router.param("projectId", project_ts_1.projectExists);
router.put("/:projectId", (0, express_validator_1.param)("projectId").isMongoId().withMessage("ID no válido"), (0, express_validator_1.body)("projectName")
    .notEmpty()
    .withMessage("El Nombre del Proyecto es Obligatorio"), (0, express_validator_1.body)("clientName")
    .notEmpty()
    .withMessage("El Nombre del Cliente es Obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage("La Descripción del Proyecto es Obligatoria"), validation_ts_1.handleInputErrors, task_ts_1.hasAuthorization, ProjectControllers_ts_1.ProjectController.updateProject);
router.delete("/:projectId", (0, express_validator_1.param)("projectId").isMongoId().withMessage("ID no válido"), validation_ts_1.handleInputErrors, task_ts_1.hasAuthorization, ProjectControllers_ts_1.ProjectController.deleteProject);
/* ---- Rutas de las Tareas ------ */
router.post("/:projectId/tasks", task_ts_1.hasAuthorization, (0, express_validator_1.body)("name")
    .notEmpty()
    .withMessage("El Nombre de la Tarea Obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage("La Descripción de la Tarea es Obligatoria"), validation_ts_1.handleInputErrors, TaskController_ts_1.TaskController.createTask);
router.get("/:projectId/tasks", TaskController_ts_1.TaskController.getProjectTasks);
router.param("taskId", task_ts_1.taskExists);
router.param("taskId", task_ts_1.taskBelongsToProject);
router.get("/:projectId/tasks/:taskId", (0, express_validator_1.param)("taskId").isMongoId().withMessage("ID no válido"), validation_ts_1.handleInputErrors, TaskController_ts_1.TaskController.getTaskById);
router.put("/:projectId/tasks/:taskId", task_ts_1.hasAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage("ID no válido"), (0, express_validator_1.body)("name").notEmpty().withMessage("El Nombre de la Tarea Obligatorio"), (0, express_validator_1.body)("description")
    .notEmpty()
    .withMessage("La Descripción de la Tarea es Obligatoria"), validation_ts_1.handleInputErrors, TaskController_ts_1.TaskController.updateTask);
router.delete("/:projectId/tasks/:taskId", task_ts_1.hasAuthorization, (0, express_validator_1.param)("taskId").isMongoId().withMessage("ID no válido"), validation_ts_1.handleInputErrors, TaskController_ts_1.TaskController.deleteTask);
/* ---- Rutas de los Estados ------ */
router.post("/:projectId/tasks/:taskId/status", (0, express_validator_1.param)("taskId").isMongoId().withMessage("ID no válido"), (0, express_validator_1.body)("status").notEmpty().withMessage("El estado es Obligatorio"), validation_ts_1.handleInputErrors, TaskController_ts_1.TaskController.updateStatus);
/* ---- Rutas por Teams ------ */
router.post('/:projectId/team/find', (0, express_validator_1.body)('email').isEmail().toLowerCase().withMessage('E-mail no válido'), validation_ts_1.handleInputErrors, TeamController_ts_1.TeamMemberController.findMemberByEmail);
router.get('/:projectId/team', TeamController_ts_1.TeamMemberController.getProjectTeam);
router.post('/:projectId/team', (0, express_validator_1.body)('id').isMongoId().withMessage('ID no válido'), validation_ts_1.handleInputErrors, TeamController_ts_1.TeamMemberController.addMemberByEmail);
router.delete('/:projectId/team/:userId', (0, express_validator_1.param)('userId').isMongoId().withMessage('ID no válido'), validation_ts_1.handleInputErrors, TeamController_ts_1.TeamMemberController.removeMemberByEmail);
/**   Rutas para  las Notas **/
router.post('/:projectId/tasks/:taskId/notes', (0, express_validator_1.body)('content')
    .notEmpty().withMessage('El Contenido de la nota es obligatorio'), validation_ts_1.handleInputErrors, NoteController_ts_1.NoteController.createNote);
router.get('/:projectId/tasks/:taskId/notes', NoteController_ts_1.NoteController.getTaskNotes);
router.delete('/:projectId/tasks/:taskId/notes/:noteId', (0, express_validator_1.param)('noteId').isMongoId().withMessage('ID No Válido'), validation_ts_1.handleInputErrors, NoteController_ts_1.NoteController.deleteNote);
exports.default = router;
