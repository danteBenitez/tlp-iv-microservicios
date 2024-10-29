import express from "express";
import { config } from "./config/config.service.js";
import { database } from "./database/index.js";
import { Server } from "./server.js";

const app = express();

const server = new Server(app);

const PORT = config.getServerPort();

server
    .onBeforeStart(async () => {
        await database.setup()
            .then(() => console.log(`Conexión exitosa a base de datos: ${config.getDatabaseOptions().NAME}`))
    })

server.start(PORT);