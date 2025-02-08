import {Router} from 'express';
import {body, param} from 'express-validator';
import { AuthController } from '../controllers/AuthControllers.ts';
import { handleInputErrors } from '../middleware/validation.ts';
import { authenticate } from '../middleware/auth.ts';

const router = Router();

router.post('/create-account', 
    body('email')
    .isEmail().withMessage('E-mail no válido'),
    body('password')
    .isLength({min: 8}).withMessage('El Password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
           throw new Error('Los Password no son iguales')
        }
        return true
    }),
    body('name')
    .notEmpty().withMessage('El Nombre no puede ir vacío'),
    handleInputErrors,
    AuthController.createAccount
)

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El Token no puede ir vacío"),
  handleInputErrors,
  AuthController.confirmAccount
);
router.post(
  "/login",
  body("email").isEmail().withMessage("E-mail no válido"),
  body("password").notEmpty().withMessage("El Password no puede ir vacío"),
  handleInputErrors,
  AuthController.login
);

router.post(
  "/request-code",
  body("email").isEmail().withMessage("E-mail no válido"),
  handleInputErrors,
  AuthController.requestConfirmationCode
);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("E-mail no válido"),
  handleInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El Token no puede ir vacío"),
  handleInputErrors,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Token no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El Password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Los Password no son iguales");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updatePasswordWithToken
);

router.get("/user",
  authenticate,
  AuthController.user
);

/**    Profile   */ 

router.put(
  "/profile",
  authenticate,
  body("email").isEmail().withMessage("E-mail no válido"),
  body("name").notEmpty().withMessage("El Nombre no puede ir vacío"),
  handleInputErrors,
  AuthController.updateProfile
);

router.post(
  "/update-password",
  authenticate,
  body("current_password").notEmpty().withMessage("El password actual no puede ir vacío"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El Password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Los Password no son iguales");
    }
    return true;
  }),
  handleInputErrors,
  AuthController.updateCurrentUserPassword
);

router.post(
  "/check-password",
  authenticate,
  body("password")
    .notEmpty()
    .withMessage("El password no puede ir vacío"),
    handleInputErrors,
    AuthController.checkPassword
);

export default router;