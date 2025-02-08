"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var AuthControllers_ts_1 = require("../controllers/AuthControllers.ts");
var validation_ts_1 = require("../middleware/validation.ts");
var auth_ts_1 = require("../middleware/auth.ts");
var router = (0, express_1.Router)();
router.post('/create-account', (0, express_validator_1.body)('email')
    .isEmail().withMessage('E-mail no válido'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('El Password es muy corto, minimo 8 caracteres'), (0, express_validator_1.body)('password_confirmation').custom(function (value, _a) {
    var req = _a.req;
    if (value !== req.body.password) {
        throw new Error('Los Password no son iguales');
    }
    return true;
}), (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El Nombre no puede ir vacío'), validation_ts_1.handleInputErrors, AuthControllers_ts_1.AuthController.createAccount);
router.post("/confirm-account", (0, express_validator_1.body)("token").notEmpty().withMessage("El Token no puede ir vacío"), validation_ts_1.handleInputErrors, AuthControllers_ts_1.AuthController.confirmAccount);
router.post("/login", (0, express_validator_1.body)("email").isEmail().withMessage("E-mail no válido"), (0, express_validator_1.body)("password").notEmpty().withMessage("El Password no puede ir vacío"), validation_ts_1.handleInputErrors, AuthControllers_ts_1.AuthController.login);
router.post("/request-code", (0, express_validator_1.body)("email").isEmail().withMessage("E-mail no válido"), validation_ts_1.handleInputErrors, AuthControllers_ts_1.AuthController.requestConfirmationCode);
router.post("/forgot-password", (0, express_validator_1.body)("email").isEmail().withMessage("E-mail no válido"), validation_ts_1.handleInputErrors, AuthControllers_ts_1.AuthController.forgotPassword);
router.post("/validate-token", (0, express_validator_1.body)("token").notEmpty().withMessage("El Token no puede ir vacío"), validation_ts_1.handleInputErrors, AuthControllers_ts_1.AuthController.validateToken);
router.post("/update-password/:token", (0, express_validator_1.param)("token").isNumeric().withMessage("Token no válido"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("El Password es muy corto, minimo 8 caracteres"), (0, express_validator_1.body)("password_confirmation").custom(function (value, _a) {
    var req = _a.req;
    if (value !== req.body.password) {
        throw new Error("Los Password no son iguales");
    }
    return true;
}), validation_ts_1.handleInputErrors, AuthControllers_ts_1.AuthController.updatePasswordWithToken);
router.get("/user", auth_ts_1.authenticate, AuthControllers_ts_1.AuthController.user);
/**    Profile   */
router.put("/profile", auth_ts_1.authenticate, (0, express_validator_1.body)("email").isEmail().withMessage("E-mail no válido"), (0, express_validator_1.body)("name").notEmpty().withMessage("El Nombre no puede ir vacío"), validation_ts_1.handleInputErrors, AuthControllers_ts_1.AuthController.updateProfile);
router.post("/update-password", auth_ts_1.authenticate, (0, express_validator_1.body)("current_password").notEmpty().withMessage("El password actual no puede ir vacío"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("El Password es muy corto, minimo 8 caracteres"), (0, express_validator_1.body)("password_confirmation").custom(function (value, _a) {
    var req = _a.req;
    if (value !== req.body.password) {
        throw new Error("Los Password no son iguales");
    }
    return true;
}), validation_ts_1.handleInputErrors, AuthControllers_ts_1.AuthController.updateCurrentUserPassword);
router.post("/check-password", auth_ts_1.authenticate, (0, express_validator_1.body)("password")
    .notEmpty()
    .withMessage("El password no puede ir vacío"), validation_ts_1.handleInputErrors, AuthControllers_ts_1.AuthController.checkPassword);
exports.default = router;
