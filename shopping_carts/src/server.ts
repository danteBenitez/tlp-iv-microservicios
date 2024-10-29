import cors from "cors";
import express, { NextFunction, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { ValidationError } from "./utils/validate-schema.js";

import cartRouter from "./routes/cart.routes.js";

type Callback = () => Promise<void>;

export class Server {
    private onBeforeStartCallbacks: Callback[];

    constructor(
        private app: express.Application
    ) {
        this.onBeforeStartCallbacks = [];
        this.addMiddleware();
        this.routes();
        // @ts-ignore La siguiente es la signatura de un manejador de errores de Express
        // según la documentación: https://expressjs.com/en/guide/error-handling.html
        this.app.use((err, req, res, next) => this.globalErrorHandler(err, req, res, next));
    }

    async start(port = 3000) {
        for (const callback of this.onBeforeStartCallbacks) {
            await callback();
        }

        return this.app.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port}`);
        })
    }

    protected routes() {
        this.app.get('/health-check', (_, res) => res.status(200).send("[SHOPPING CART] Servidor funcionando correctamente"));
        this.app.use(cartRouter);
    }

    protected addParsers() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    globalErrorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
        if (err instanceof ValidationError) {
            return res.status(400).json(err.issues());
        }


        console.error(err);
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }

    protected addMiddleware() {
        this.addParsers();

        this.app.use(morgan("dev"));
        this.app.use(helmet());
        this.app.use(cors({
            origin: "*"
        }));
    }

    /**
     * Registra un callback a ser llamado antes de iniciar el servidor.
     */
    onBeforeStart(callback: Callback) {
        this.onBeforeStartCallbacks.push(callback);
    }
}