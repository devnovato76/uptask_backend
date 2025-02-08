import type {Request, Response} from 'express';
import User from '../models/User.ts';
import { checkPassword, hashPassword } from '../utils/auth.ts';
import Token from '../models/Token.ts';
import { generateToken } from '../utils/token.ts';
import {AuthEmail} from '../emails/AuthEmail.ts';
import { generateJWT } from '../utils/jwt.ts';


export class AuthController {
  static createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { password, email } = req.body;
      // Prevenir duplicados
      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error("El Usuario ya está registrado");
       res.status(409).json({ error: error.message });
        return;
      }
      // crea un Usuario
      const user = new User(req.body);
      // Hash Password
      user.password = await hashPassword(password);
      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      // enviar el email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });
      await Promise.allSettled([user.save(), token.save()]);
      res.send("Cuenta creada, revisa tu e-mail para confirmarla");
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      return;
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        res.status(404).json({
          error: error.message,
        });
        return;
      }
      const user = await User.findById(tokenExist.user);
      user.confirmed = true;
      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      return;
    }
  };
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("Usuario no encontrado");
        res.status(404).json({
          error: error.message,
        });
        return;
      }
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();
        // enviar el email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });
        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación"
        );
        res.status(401).json({
          error: error.message,
        });
        return;
      }
      // Revisar Password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Password Incorrecto");
        res.status(401).json({
          error: error.message,
        });
        return;
      }
      const token = generateJWT({ id: user.id  });
      res.send(token);
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      return;
    }
  };
  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      // Usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El Usuario no está registrado");
        res.status(404).json({ error: error.message });
        return;
      }
      if (user.confirmed) {
        const error = new Error("El Usuario ya está confirmado");
        res.status(403).json({ error: error.message });
        return;
      }

      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      // enviar el email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });
      await Promise.allSettled([user.save(), token.save()]);
      res.send("Se envió un nuevo token a tu e-mail");
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      return;
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      // Usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El Usuario no está registrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // Generar token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      // enviar el email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });
      res.send("Revisa tu e-mail para instrucciones");
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      return;
    }
  };
  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        res.status(404).json({
          error: error.message,
        });
        return;
      }
      res.send("Token válido, Define tu nuevo password");
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      return;
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        res.status(404).json({
          error: error.message,
        });
        return;
      }
      const user = await User.findById(tokenExist.user);
      user.password = await hashPassword(password);

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.send("El password se modificó correctamente");
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      return;
    }
  };

  static user = async (req: Request, res: Response): Promise<void> => {
    res.json(req.user);
    return;
  };

  static updateProfile = async (req: Request, res: Response): Promise<void> => {
    const {name, email} = req.body;
    
    const userExists = await User.findOne({email})
    if(userExists && userExists.id.toString() !== req.user.id.toString()) {
      const error = new Error('Ese email ya esta registrado')
      res.status(409).json({error: error.message})
      return;
    }
    req.user.name = name;
    req.user.email = email;

    try {
      await req.user.save();
      res.send('Perfil actualizado correctamente')
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
      return;
    }
  };
  static updateCurrentUserPassword = async (req: Request, res: Response): Promise<void> => {
    const {current_password, password} = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(current_password, user.password);
    if(!isPasswordCorrect){
      const error = new Error("El Password actual es incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }
    try {
      user.password = await hashPassword(password);
      await user.save();
      res.send("El PassWord se modificó correctamente");
    return;
    } catch (error) {
       res.status(500).json({ error: "Hubo un error" });
    }

    
  }
   static checkPassword = async (req: Request, res: Response): Promise<void> => {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("El Password es incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }
    res.send('Password correcto')
   }
}