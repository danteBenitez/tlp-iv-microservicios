import express from "express";
import { messageBrokerAdapter } from "./adapter/broker.adapter.js";
import { config } from "./config/config.service.js";
import { database } from "./database/index.js";
import { Server } from "./server.js";

const app = express();

const server = new Server(app);

const PORT = config.getServerPort();

server
    .onBeforeStart(async () => {
        await database.setup()
            .then(() => console.log(`Conexión exitosa a base de datos: ${config.getDatabaseOptions().DIALECT}`))
    })

server
    .onBeforeStart(async () => {
        await messageBrokerAdapter.connect()
            .then(() => console.log("Conexión exitosa a broker de mensajes"));
    })

server.start(PORT);