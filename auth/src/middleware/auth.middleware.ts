import { NextFunction, Request, Response } from "express";
import { UsersService, usersService } from "../services/user.service.js";

export class AuthMiddleware {

    constructor(
        private userService: UsersService
    ) { }

    async execute(req: Request, res: Response, next: NextFunction) {
        const token = this.parseTokenFromHeader(req.headers.authorization ?? "");
        if (!token) {
            return res.status(401).json({
                message: "Token inválido",
            });
        }
        const user = await this.userService.findForToken(token);
        if (!user) {
            return res.status(401).json({
                message: "No estás autenticado",
            });
        }

        req.user = user;
        next();
    }

    private parseTokenFromHeader(header: string) {
        const matches = /Bearer (.+)/.exec(header);
        if (!matches) {
            return null;
        }
        return matches[1];
    }
}

const middlewareInstance = new AuthMiddleware(usersService);
export const authMiddleware =
    middlewareInstance.execute.bind(middlewareInstance);