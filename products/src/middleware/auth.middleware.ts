import { NextFunction, Request, Response } from "express";
import { usersService, UsersService } from "../services/user.service";

export class AuthMiddleware {

    constructor(private userService: UsersService) { }

    async execute(req: Request, res: Response, next: NextFunction) {
        // TODO: Implementar chequeo de cabecera de autenticación
        const userId = req.header("X-Authentication-Id");
        if (!userId) {
            return res.status(401).json({
                message: "No estás autenticado"
            });
        }
        const numberId = parseInt(userId);
        if (Number.isNaN(numberId)) {
            console.warn(`ID de usuario inválida: ${numberId}`);
            return res.status(401).json({
                message: "No estás autenticado"
            });
        }
        const user = await this.userService.findById(numberId);

        if (!user) {
            return res.status(401).json({
                message: "Usuario inválido"
            });
        }

        req.user = user;
        next();
    }
}

const middlewareInstance = new AuthMiddleware(usersService);
export const authMiddleware =
    middlewareInstance.execute.bind(middlewareInstance);