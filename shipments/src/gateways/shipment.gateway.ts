import { EventEmitter2 } from "eventemitter2";
import { Server } from "socket.io";
import { eventEmitter as eventEmitter_ } from "../events/emitter";
import { NewShipmentEvent, ShipmentStatusChanged } from "../events/shipment.event";

export class ShipmentGateway {
    constructor(
        private ioServer: Server,
        private eventEmitter: EventEmitter2 = eventEmitter_
    ) { }

    setup() {
        this.ioServer.on("connect", (socket) => {
            socket.on('subscribe-sale', (saleId) => socket.join(saleId));
        })
        this.eventEmitter.on(NewShipmentEvent.type, (e: NewShipmentEvent) => this.onNewShipment(e));
        this.eventEmitter.on(ShipmentStatusChanged.type, (e: ShipmentStatusChanged) => this.onShipmentStatusChanged(e));
    }

    onNewShipment(event: NewShipmentEvent) {
        console.log("New ShipmentEvent emitted");
        this.ioServer.emit('new-shipment', event.shipment);
    }

    onShipmentStatusChanged(event: ShipmentStatusChanged) {
        console.log("Shipment Status event emitted");
        this.ioServer.emit('shipment-status-changed', event.shipment);
    }
}