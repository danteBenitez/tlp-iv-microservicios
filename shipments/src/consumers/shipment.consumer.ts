import { BrokerAdapter } from "../adapters/broker.adapter";
import { SHIPMENT_STATUS } from "../constants/shipment-status.constant";
import { ISale } from "../interface/sale.interface";
import { IUser } from "../interface/user.interface";
import { ShipmentService, shipmentService as shipmentService_ } from "../services/shipment.service";

export class ShipmentConsumer {
    constructor(
        private shipmentService: ShipmentService = shipmentService_,
        private brokerClient: BrokerAdapter
    ) { }

    setup() {
        this.brokerClient.consume("sold-items", (msg) => {
            if (msg) this.brokerClient.ackMessage(msg);
            this.brokerClient
            if (!msg?.content) {
                throw new Error("Contenido inesperado de mensaje");
            }
            const data = JSON.parse(msg?.content.toString("utf-8"));
            this.consumeSoldProducts(data.user, data.sale, data.address);
        });
        this.brokerClient.consume("shipment-started", (msg) => {
            if (msg) this.brokerClient.ackMessage(msg);
            if (!msg?.content) {
                throw new Error("Contenido inesperado de mensaje");
            }
            const data = JSON.parse(msg?.content.toString("utf-8"));
            this.consumeShipmentStarted(data.shipmentId);
        })
        this.brokerClient.consume("shipment-arrived", (msg) => {
            if (msg) this.brokerClient.ackMessage(msg);
            if (!msg?.content) {
                throw new Error("Contenido inesperado de mensaje");
            }
            const data = JSON.parse(msg?.content.toString("utf-8"));
            this.consumeShipmentArrived(data.shipmentId);
        });
    }

    async consumeSoldProducts(user: IUser, sale: ISale, address: string) {
        const shipment = await this.shipmentService.createInStock({
            saleId: sale.saleId,
            address,
            userId: user.userId.toString()
        });
        setTimeout(() => {
            this.brokerClient.sendToQueue("shipment-started", {
                shipmentId: shipment?.shipmentId
            });
        }, 10_000);
    }

    async consumeShipmentStarted(shipmentId: string) {
        await this.shipmentService.update(shipmentId, {
            status: SHIPMENT_STATUS.TRAVELING
        });
        setTimeout(() => {
            this.brokerClient.sendToQueue("shipment-arrived", {
                shipmentId
            });
        }, 1_000);
    }

    async consumeShipmentArrived(shipmentId: string) {
        await this.shipmentService.update(shipmentId, {
            status: SHIPMENT_STATUS.DELIVERED
        });
    }
}