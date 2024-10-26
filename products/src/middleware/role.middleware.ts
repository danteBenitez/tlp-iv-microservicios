import { NextFunction, Request, Response } from "express";
import { RoleName } from "../constants/roles.constant.js";
import { usersService, UsersService } from "../services/user.service.js";
import { authMiddleware } from "./auth.middleware.js";

export class RoleMiddleware {
    constructor(
        private userService: UsersService,
        private role: RoleName
    ) { }

    async execute(req: Request, res: Response, next: NextFunction) {
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