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
exports.TeamMemberController = void 0;
var User_ts_1 = require("../models/User.ts");
var Project_ts_1 = require("../models/Project.ts");
var TeamMemberController = /** @class */ (function () {
    function TeamMemberController() {
    }
    var _a;
    _a = TeamMemberController;
    TeamMemberController.findMemberByEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var email, user, error;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    email = req.body.email;
                    return [4 /*yield*/, User_ts_1.default.findOne({ email: email }).select('id name email')];
                case 1:
                    user = _b.sent();
                    if (!user) {
                        error = new Error("Usuario no encontrado");
                        res.status(404).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    res.json(user);
                    return [2 /*return*/];
            }
        });
    }); };
    TeamMemberController.getProjectTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var project;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Project_ts_1.default.findById(req.project.id).populate({
                        path: 'team',
                        select: 'id name email'
                    })];
                case 1:
                    project = _b.sent();
                    res.json(project.team);
                    return [2 /*return*/];
            }
        });
    }); };
    TeamMemberController.addMemberByEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, user, error, error;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.body.id;
                    return [4 /*yield*/, User_ts_1.default.findById(id).select("id")];
                case 1:
                    user = _b.sent();
                    if (!user) {
                        error = new Error("Usuario no encontrado");
                        res.status(404).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    if (req.project.team.some(function (team) { return team.toString() === user.id.toString(); })) {
                        error = new Error("El usuario ya existe en el Proyecto");
                        res.status(409).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    req.project.team.push(user.id);
                    return [4 /*yield*/, req.project.save()];
                case 2:
                    _b.sent();
                    res.send("Usuario agregado correctamente");
                    return [2 /*return*/];
            }
        });
    }); };
    TeamMemberController.removeMemberByEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, error;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = req.params.userId;
                    if (!req.project.team.some(function (team) { return team.toString() === userId.toString(); })) {
                        error = new Error("El usuario no existe en el Proyecto");
                        res.status(409).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    req.project.team = req.project.team.filter(function (teamMember) { return teamMember.toString() !== userId.toString(); });
                    return [4 /*yield*/, req.project.save()];
                case 1:
                    _b.sent();
                    res.send("Usuario eliminado correctamente");
                    return [2 /*return*/];
            }
        });
    }); };
    return TeamMemberController;
}());
exports.TeamMemberController = TeamMemberController;
;
