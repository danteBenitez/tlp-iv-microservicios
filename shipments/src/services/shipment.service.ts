import { EventEmitter2 } from "eventemitter2";
import { SHIPMENT_STATUS } from "../constants/shipment-status.constant";
import { eventEmitter as eventEmitter_ } from "../events/emitter";
import { NewShipmentEvent, ShipmentStatusChanged } from "../events/shipment.event";
import { IShipment } from "../interface/shipment.interface";
import { IShipmentRepository, shipmentRepository } from "../repositories/shipment.repository";

export class ShipmentNotFoundError extends Error { }

export class ShipmentService {

    constructor(
        private repository: IShipmentRepository = shipmentRepository,
        private eventEmitter: EventEmitter2 = eventEmitter_
    ) { }

    async findAllShipments() {
        const found = await this.repository.findAll();
        if (found?.length === 0) throw new ShipmentNotFoundError("No hay envíos registrados");
        return found;
    }

    async findById(shipmentId: string) {
        const found = await this.repository.findById(shipmentId);
        if (!found) throw new ShipmentNotFoundError("Envío no encontrado");
        return found;
    }

    async findForUser(shipmentId: string) {
        const found = await this.repository.findAllForUser(shipmentId);
        if (!found) throw new ShipmentNotFoundError("El usuario no tiene envíos");
        return found;
    }

    async createInStock(data: Omit<IShipment, "shipmentId" | "status">) {
        const created = await this.repository.create({
            ...data,
            status: SHIPMENT_STATUS.IN_STOCK
        });
        if (!created) throw new Error("No se puedo crear el envío");
        this.eventEmitter.emit(NewShipmentEvent.type, new NewShipmentEvent(created));
        return created;
    }

    async update(shipmentId: string, data: Partial<IShipment>) {
        const updated = await this.repository.update(shipmentId, data);
        if (!updated) throw new ShipmentNotFoundError("Envío no encontrado");
        if (data.status) {
            this.eventEmitter.emit(ShipmentStatusChanged.type, new ShipmentStatusChanged(updated));
        }
        return updated;
    }
}

export const shipmentService = new ShipmentService();