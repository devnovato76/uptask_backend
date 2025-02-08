"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
var Task_ts_1 = require("../models/Task.ts");
var TaskController = /** @class */ (function () {
    function TaskController() {
    }
    var _a;
    _a = TaskController;
    TaskController.createTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var task, error_1;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    task = new Task_ts_1.default(req.body);
                    task.project = req.project.id;
                    req.project.tasks.push(task.id);
                    return [4 /*yield*/, Promise.allSettled([task.save(), req.project.save()])];
                case 1:
                    _b.sent();
                    res.send("Tarea Creada Correctamente");
                    return [2 /*return*/];
                case 2:
                    error_1 = _b.sent();
                    res.status(500).json({
                        error: "Hubo un error",
                    });
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    TaskController.getProjectTasks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var tasks, error_2;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Task_ts_1.default.find({ project: req.project.id }).populate('project')];
                case 1:
                    tasks = _b.sent();
                    res.json(tasks);
                    return [2 /*return*/];
                case 2:
                    error_2 = _b.sent();
                    res.status(500).json({
                        error: "Hubo un error",
                    });
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    TaskController.getTaskById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var task, error_3;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, Task_ts_1.default.findById(req.task.id)];
                case 1: return [4 /*yield*/, (_b.sent()).populate({
                        path: "completedBy.user",
                        select: "id name email",
                    })];
                case 2: return [4 /*yield*/, (_b.sent()).populate({
                        path: "notes",
                        populate: { path: "createBy", select: "id name email" },
                    })];
                case 3:
                    task = _b.sent();
                    res.json(task);
                    return [2 /*return*/];
                case 4:
                    error_3 = _b.sent();
                    res.status(500).json({
                        error: "Hubo un error",
                    });
                    return [2 /*return*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    TaskController.updateTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var error, error_4;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (req.task.project.toString() !== req.project.id) {
                        error = new Error('Acción no válida');
                        res.status(400).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    req.task.name = req.body.name;
                    req.task.description = req.body.description;
                    return [4 /*yield*/, req.task.save()];
                case 1:
                    _b.sent();
                    res.send('Tarea Actualizada Correctamente');
                    return [2 /*return*/];
                case 2:
                    error_4 = _b.sent();
                    res.status(500).json({
                        error: "Hubo un error",
                    });
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    TaskController.deleteTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    req.project.tasks = req.project.tasks.filter(function (task) { return task.toString() !== req.task.id.toString(); });
                    return [4 /*yield*/, Promise.allSettled([req.task.deleteOne(), req.project.save()])];
                case 1:
                    _b.sent();
                    res.send('Tarea Eliminada Correctamente');
                    return [2 /*return*/];
                case 2:
                    error_5 = _b.sent();
                    res.status(500).json({
                        error: "Hubo un error",
                    });
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    TaskController.updateStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var status_1, data, error_6;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    status_1 = req.body.status;
                    req.task.status = status_1;
                    data = {
                        user: req.user.id,
                        status: status_1
                    };
                    req.task.completedBy.push(data);
                    return [4 /*yield*/, req.task.save()];
                case 1:
                    _b.sent();
                    res.send('Tarea Actulizada');
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _b.sent();
                    res.status(500).json({
                        error: "Hubo un error"
                    });
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return TaskController;
}());
exports.TaskController = TaskController;
