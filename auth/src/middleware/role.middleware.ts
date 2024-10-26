import { NextFunction, Request, Response } from "express";
import { RoleName } from "../constants/roles.constant.js";
import { UsersService, usersService } from "../services/user.service.js";
import { authMiddleware } from "./auth.middleware.js";

export class RoleMiddleware {
    constructor(
        private userService: UsersService,
        private role: RoleName
    ) { }

    async execute(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            console.warn(
                "No se pudo encontrar usuario en la petición al verificar rol."
            );
            return res.status(401).json({
                message: "No se encuentra autorizado",
            });
        }

        const matches = await this.userService.matchesRole(req.user, this.role);

        if (!matches) {
            return res.status(401).json({
                message: "No se encuentra autorizado",
            });
        }

        return next();
    }
}

/**
 * Retorna un arreglo de middlewares que chequean si:
 *  - la petición está autenticada
 *  - el usuario tiene el rol especificado.
*/
export function roleMiddleware(role: RoleName) {
    const instance = new RoleMiddleware(usersService, role);
    return [authMiddleware, instance.execute.bind(instance)];
}