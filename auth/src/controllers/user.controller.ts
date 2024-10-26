import { Request, Response } from "express";
import { ConflictingUserError, SafeUser, UserNotFoundError, UsersService } from "../services/user.service";
import { validateRequest } from "../utils/validate-schema";
import { createUserByAdminSchema, updateUserByAdminSchema, updateUserSchema, userIdSchema } from "../validations/user.schema";

export class UserController {
    constructor(
        private userService: UsersService
    ) { }

    async findAllUsers(req: Request, res: Response) {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                message: "Usuario no autenticado",
            });
        }

        const users = await this.userService.findAll();

        return res.status(200).json({
            users,
        });
    }

    async findById(req: Request, res: Response) {
        const { data, error, success } = await validateRequest(req, userIdSchema);
        if (!success) {
            return res.status(400).json(error);
        }
        const user = await this.userService.findById(data.params.userId);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        delete (user as SafeUser).password;

        res.status(200).json({ user });
    }

    async deleteUserById(req: Request, res: Response) {
        const { data, error, success } = await validateRequest(req, userIdSchema)
        if (!success) {
            return res.status(400).json(error);
        }
        const deleted = await this.userService.delete(data.params.userId);

        if (!deleted) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            message: "Usuario eliminado exitosamente",
        });
    }

    async create(req: Request, res: Response) {
        const { data, success, error } = await validateRequest(req, createUserByAdminSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const { user } = await this.userService.create(data.body);


            return res.status(201).json(user);

        } catch (err) {
            if (err instanceof ConflictingUserError) {
                return res.status(409).json({
                    message: err.message
                });
            }

            console.error("Error al crear usuario: ", err);
            res.status(500).json({
                message: "Error interno del servidor"
            });
        }

    }

    async updateProfile(req: Request, res: Response) {
        const user = req.user;
        const { data, success, error } = await validateRequest(req, updateUserSchema);
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const updated = await this.userService.updateProfile(user.userId, data.body);

            res.status(200).json({
                user: updated,
                message: "Perfil actualizado correctamente",
            });
        } catch (err) {
            if (err instanceof UserNotFoundError) {
                return res.status(404).json({
                    message: err.message,
                });
            }
            if (err instanceof ConflictingUserError) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            console.error("Error al actualizar perfil: ", err);
            return res.status(500).json({
                message: "Error interno del servidor",
            });
        }
    }

    async updateUserById(req: Request, res: Response) {
        const { data, error, success } = await validateRequest(req, updateUserByAdminSchema)
        if (!success) {
            return res.status(400).json(error);
        }

        try {
            const updated = await this.userService.updateByAdmin(data.params.userId, data.body);

            res.status(200).json({
                user: updated,
                message: "Usuario actualizado correctamente",
            });
        } catch (err) {
            if (err instanceof UserNotFoundError) {
                return res.status(404).json({
                    message: err.message,
                });
            }
            if (err instanceof ConflictingUserError) {
                return res.status(400).json({
                    message: err.message,
                });
            }
            console.error("Error al actualizar perfil: ", err);
            return res.status(500).json({
                message: "Error interno del servidor",
            });
        }
    }
}