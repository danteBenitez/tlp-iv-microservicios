import { NextFunction, Request, Response } from "express";
import { RoleName, ROLES } from "../constants/roles.constant.js";
import { IUser } from "../interfaces/user.interface.js";
import { authMiddleware } from "./auth.middleware.js";

export class RoleMiddleware {
    constructor(
        private role: RoleName
    ) { }

    async execute(req: Request, res: Response, next: NextFunction) {
        const user: IUser = req.user;
        if (!user) {
            return res.status(401).json({
                message: "No estás autorizado"
            })
        }

        const hasRole = user.roles.find(r => r.name == ROLES.ADMIN);

        if (hasRole) {
            next()
        } else {
            return res.status(401).json({
                message: "No estás autorizado"
            });
        }
    }
}

/**
 * Retorna un arreglo de middlewares que chequean si:
 *  - la petición está autenticada
 *  - el usuario tiene el rol especificado.
*/
export function roleMiddleware(role: RoleName) {
    const instance = new RoleMiddleware(role);
    return [authMiddleware, instance.execute.bind(instance)];
}