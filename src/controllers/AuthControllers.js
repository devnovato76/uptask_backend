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
exports.AuthController = void 0;
var User_ts_1 = require("../models/User.ts");
var auth_ts_1 = require("../utils/auth.ts");
var Token_ts_1 = require("../models/Token.ts");
var token_ts_1 = require("../utils/token.ts");
var AuthEmail_ts_1 = require("../emails/AuthEmail.ts");
var jwt_ts_1 = require("../utils/jwt.ts");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    var _a;
    _a = AuthController;
    AuthController.createAccount = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _b, password, email, userExist, error, user, _c, token, error_1;
        return __generator(_a, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 4, , 5]);
                    _b = req.body, password = _b.password, email = _b.email;
                    return [4 /*yield*/, User_ts_1.default.findOne({ email: email })];
                case 1:
                    userExist = _d.sent();
                    if (userExist) {
                        error = new Error("El Usuario ya está registrado");
                        res.status(409).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    user = new User_ts_1.default(req.body);
                    // Hash Password
                    _c = user;
                    return [4 /*yield*/, (0, auth_ts_1.hashPassword)(password)];
                case 2:
                    // Hash Password
                    _c.password = _d.sent();
                    token = new Token_ts_1.default();
                    token.token = (0, token_ts_1.generateToken)();
                    token.user = user.id;
                    // enviar el email
                    AuthEmail_ts_1.AuthEmail.sendConfirmationEmail({
                        email: user.email,
                        name: user.name,
                        token: token.token,
                    });
                    return [4 /*yield*/, Promise.allSettled([user.save(), token.save()])];
                case 3:
                    _d.sent();
                    res.send("Cuenta creada, revisa tu e-mail para confirmarla");
                    return [2 /*return*/];
                case 4:
                    error_1 = _d.sent();
                    res.status(500).json({ error: "Hubo un error" });
                    return [2 /*return*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    AuthController.confirmAccount = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var token, tokenExist, error, user, error_2;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    token = req.body.token;
                    return [4 /*yield*/, Token_ts_1.default.findOne({ token: token })];
                case 1:
                    tokenExist = _b.sent();
                    if (!tokenExist) {
                        error = new Error("Token no válido");
                        res.status(404).json({
                            error: error.message,
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_ts_1.default.findById(tokenExist.user)];
                case 2:
                    user = _b.sent();
                    user.confirmed = true;
                    return [4 /*yield*/, Promise.allSettled([user.save(), tokenExist.deleteOne()])];
                case 3:
                    _b.sent();
                    res.send("Cuenta confirmada correctamente");
                    return [2 /*return*/];
                case 4:
                    error_2 = _b.sent();
                    res.status(500).json({ error: "Hubo un error" });
                    return [2 /*return*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    AuthController.login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _b, email, password, user, error, token_1, error, isPasswordCorrect, error, token, error_3;
        return __generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    _b = req.body, email = _b.email, password = _b.password;
                    return [4 /*yield*/, User_ts_1.default.findOne({ email: email })];
                case 1:
                    user = _c.sent();
                    if (!user) {
                        error = new Error("Usuario no encontrado");
                        res.status(404).json({
                            error: error.message,
                        });
                        return [2 /*return*/];
                    }
                    if (!!user.confirmed) return [3 /*break*/, 3];
                    token_1 = new Token_ts_1.default();
                    token_1.user = user.id;
                    token_1.token = (0, token_ts_1.generateToken)();
                    return [4 /*yield*/, token_1.save()];
                case 2:
                    _c.sent();
                    // enviar el email
                    AuthEmail_ts_1.AuthEmail.sendConfirmationEmail({
                        email: user.email,
                        name: user.name,
                        token: token_1.token,
                    });
                    error = new Error("La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación");
                    res.status(401).json({
                        error: error.message,
                    });
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, (0, auth_ts_1.checkPassword)(password, user.password)];
                case 4:
                    isPasswordCorrect = _c.sent();
                    if (!isPasswordCorrect) {
                        error = new Error("Password Incorrecto");
                        res.status(401).json({
                            error: error.message,
                        });
                        return [2 /*return*/];
                    }
                    token = (0, jwt_ts_1.generateJWT)({ id: user.id });
                    res.send(token);
                    return [2 /*return*/];
                case 5:
                    error_3 = _c.sent();
                    res.status(500).json({ error: "Hubo un error" });
                    return [2 /*return*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    AuthController.requestConfirmationCode = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var email, user, error, error, token, error_4;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    email = req.body.email;
                    return [4 /*yield*/, User_ts_1.default.findOne({ email: email })];
                case 1:
                    user = _b.sent();
                    if (!user) {
                        error = new Error("El Usuario no está registrado");
                        res.status(404).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    if (user.confirmed) {
                        error = new Error("El Usuario ya está confirmado");
                        res.status(403).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    token = new Token_ts_1.default();
                    token.token = (0, token_ts_1.generateToken)();
                    token.user = user.id;
                    // enviar el email
                    AuthEmail_ts_1.AuthEmail.sendConfirmationEmail({
                        email: user.email,
                        name: user.name,
                        token: token.token,
                    });
                    return [4 /*yield*/, Promise.allSettled([user.save(), token.save()])];
                case 2:
                    _b.sent();
                    res.send("Se envió un nuevo token a tu e-mail");
                    return [2 /*return*/];
                case 3:
                    error_4 = _b.sent();
                    res.status(500).json({ error: "Hubo un error" });
                    return [2 /*return*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    AuthController.forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var email, user, error, token, error_5;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    email = req.body.email;
                    return [4 /*yield*/, User_ts_1.default.findOne({ email: email })];
                case 1:
                    user = _b.sent();
                    if (!user) {
                        error = new Error("El Usuario no está registrado");
                        res.status(404).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    token = new Token_ts_1.default();
                    token.token = (0, token_ts_1.generateToken)();
                    token.user = user.id;
                    return [4 /*yield*/, token.save()];
                case 2:
                    _b.sent();
                    // enviar el email
                    AuthEmail_ts_1.AuthEmail.sendPasswordResetToken({
                        email: user.email,
                        name: user.name,
                        token: token.token,
                    });
                    res.send("Revisa tu e-mail para instrucciones");
                    return [2 /*return*/];
                case 3:
                    error_5 = _b.sent();
                    res.status(500).json({ error: "Hubo un error" });
                    return [2 /*return*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    AuthController.validateToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var token, tokenExist, error, error_6;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    token = req.body.token;
                    return [4 /*yield*/, Token_ts_1.default.findOne({ token: token })];
                case 1:
                    tokenExist = _b.sent();
                    if (!tokenExist) {
                        error = new Error("Token no válido");
                        res.status(404).json({
                            error: error.message,
                        });
                        return [2 /*return*/];
                    }
                    res.send("Token válido, Define tu nuevo password");
                    return [2 /*return*/];
                case 2:
                    error_6 = _b.sent();
                    res.status(500).json({ error: "Hubo un error" });
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    AuthController.updatePasswordWithToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var token, password, tokenExist, error, user, _b, error_7;
        return __generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    token = req.params.token;
                    password = req.body.password;
                    return [4 /*yield*/, Token_ts_1.default.findOne({ token: token })];
                case 1:
                    tokenExist = _c.sent();
                    if (!tokenExist) {
                        error = new Error("Token no válido");
                        res.status(404).json({
                            error: error.message,
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, User_ts_1.default.findById(tokenExist.user)];
                case 2:
                    user = _c.sent();
                    _b = user;
                    return [4 /*yield*/, (0, auth_ts_1.hashPassword)(password)];
                case 3:
                    _b.password = _c.sent();
                    return [4 /*yield*/, Promise.allSettled([user.save(), tokenExist.deleteOne()])];
                case 4:
                    _c.sent();
                    res.send("El password se modificó correctamente");
                    return [2 /*return*/];
                case 5:
                    error_7 = _c.sent();
                    res.status(500).json({ error: "Hubo un error" });
                    return [2 /*return*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    AuthController.user = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(_a, function (_b) {
            res.json(req.user);
            return [2 /*return*/];
        });
    }); };
    AuthController.updateProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _b, name, email, userExists, error, error_8;
        return __generator(_a, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = req.body, name = _b.name, email = _b.email;
                    return [4 /*yield*/, User_ts_1.default.findOne({ email: email })];
                case 1:
                    userExists = _c.sent();
                    if (userExists && userExists.id.toString() !== req.user.id.toString()) {
                        error = new Error('Ese email ya esta registrado');
                        res.status(409).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    req.user.name = name;
                    req.user.email = email;
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, req.user.save()];
                case 3:
                    _c.sent();
                    res.send('Perfil actualizado correctamente');
                    return [2 /*return*/];
                case 4:
                    error_8 = _c.sent();
                    res.status(500).json({ error: "Hubo un error" });
                    return [2 /*return*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    AuthController.updateCurrentUserPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _b, current_password, password, user, isPasswordCorrect, error, _c, error_9;
        return __generator(_a, function (_d) {
            switch (_d.label) {
                case 0:
                    _b = req.body, current_password = _b.current_password, password = _b.password;
                    return [4 /*yield*/, User_ts_1.default.findById(req.user.id)];
                case 1:
                    user = _d.sent();
                    return [4 /*yield*/, (0, auth_ts_1.checkPassword)(current_password, user.password)];
                case 2:
                    isPasswordCorrect = _d.sent();
                    if (!isPasswordCorrect) {
                        error = new Error("El Password actual es incorrecto");
                        res.status(401).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 6, , 7]);
                    _c = user;
                    return [4 /*yield*/, (0, auth_ts_1.hashPassword)(password)];
                case 4:
                    _c.password = _d.sent();
                    return [4 /*yield*/, user.save()];
                case 5:
                    _d.sent();
                    res.send("El PassWord se modificó correctamente");
                    return [2 /*return*/];
                case 6:
                    error_9 = _d.sent();
                    res.status(500).json({ error: "Hubo un error" });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    AuthController.checkPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var password, user, isPasswordCorrect, error;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0:
                    password = req.body.password;
                    return [4 /*yield*/, User_ts_1.default.findById(req.user.id)];
                case 1:
                    user = _b.sent();
                    return [4 /*yield*/, (0, auth_ts_1.checkPassword)(password, user.password)];
                case 2:
                    isPasswordCorrect = _b.sent();
                    if (!isPasswordCorrect) {
                        error = new Error("El Password es incorrecto");
                        res.status(401).json({ error: error.message });
                        return [2 /*return*/];
                    }
                    res.send('Password correcto');
                    return [2 /*return*/];
            }
        });
    }); };
    return AuthController;
}());
exports.AuthController = AuthController;
