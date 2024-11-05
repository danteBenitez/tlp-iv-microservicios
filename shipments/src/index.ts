import express from "express";
import { Server as SocketServer } from "socket.io";
import { messageBrokerAdapter } from "./adapters/broker.adapter.js";
import { config } from "./config/config.service.js";
import { ShipmentConsumer } from "./consumers/shipment.consumer.js";
import { database } from "./database/index.js";
import { ShipmentGateway } from "./gateways/shipment.gateway.js";
import { Server } from "./server.js";
import { shipmentService } from "./services/shipment.service.js";

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
            .then(() => console.log("Conexión exitosa a broker de mensajes"))
            .then(() => new ShipmentConsumer(shipmentService, messageBrokerAdapter).setup())
    })

server.start(PORT)
    .then(server => {
        const ioServer = new SocketServer({
            path: "/ws",
            cors: {
                origin: "*"
            },
        }).attach(server);
        new ShipmentGateway(ioServer).setup();
    });
