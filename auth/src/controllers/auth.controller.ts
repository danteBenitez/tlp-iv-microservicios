import { type Request, type Response } from "express";

import {
    ConflictingUserError,
    InvalidRoleError,
    InvalidSignInError,
    UsersService
} from "../services/user.service.js";
import { validateRequestBody } from "../utils/validate-schema.js";
import { createUserSchema, signInSchema } from "../validations/user.schema.js";

export class AuthController {
    constructor(
        private userService: UsersService
    ) { }


    async signIn(req: Request, res: Response) {
        const { data, success, error } = await validateRequestBody(req, signInSchema);
        if (!success) {
            return res.status(400).json(error);
        }
        try {
            const { user, token } = await this.userService.signIn({
                username: data.username,
                password: data.password,
            });

            res.status(200).json({
                user,
                token,
                message: "Iniciado sesión correctamente",
            });
        } catch (err) {
            if (err instanceof InvalidSignInError) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            console.error("Error al iniciar sesión: ", err);
            res.status(500).json({
                message: "Error interno del servidor",
            });
        }
    }

    async signUp(req: Request, res: Response) {
        const { data, success, error } = await validateRequestBody(req, createUserSchema);
        if (!success) {
            return res.status(400).json(error);
        }
        try {
            const { user, token } = await this.userService.signUp(data);

            const { password: _, ...withoutPassword } = user.toJSON();

            res.status(200).json({
                user: withoutPassword,
                token,
                message: "Registrado correctamente",
            });

        } catch (err) {
            console.error("Error al registrar usuario: ", err);
            if (err instanceof InvalidRoleError) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            if (err instanceof ConflictingUserError) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            res.status(500).json({
                message: "Error interno del servidor",
            });
        }
    }

    getProfile(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({
                message: "No estás autenticado"
            });
        }
        res.status(200).json(req.user);
    }

}