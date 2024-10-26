import { NextFunction, Request, Response } from "express";

export class AuthMiddleware {

    async execute(req: Request, res: Response, next: NextFunction) {
        // TODO: Implementar chequeo de cabecera de autenticación
    }
}

const middlewareInstance = new AuthMiddleware();
export const authMiddleware =
    middlewareInstance.execute.bind(middlewareInstance);