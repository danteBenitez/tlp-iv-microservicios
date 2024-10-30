import { IShipment } from "../interface/shipment.interface";
import Shipment from "../models/shipment.model";

export interface IShipmentRepository {
    findById(shipmentId: string): Promise<IShipment | null>
    findAll(): Promise<IShipment[]>
    findAllForUser(userId: string): Promise<IShipment[] | null>
    create(data: Omit<IShipment, "shipmentId">): Promise<IShipment | null>
    update(shipmentId: string, data: Partial<IShipment>): Promise<IShipment | null>
}

class PostgresShipmentRepository implements IShipmentRepository {

    constructor(private shipmentModel: typeof Shipment = Shipment) { }

    create(data: Omit<IShipment, "shipmentId">): Promise<IShipment | null> {
        return this.shipmentModel.create(data);
    }

    findAll(): Promise<IShipment[]> {
        return this.shipmentModel.findAll();
    }

    findById(shipmentId: string): Promise<IShipment | null> {
        return this.shipmentModel.findByPk(shipmentId);
    }

    findAllForUser(userId: string): Promise<IShipment[] | null> {
        return this.shipmentModel.findAll({
            where: { userId }
        });
    }

    async update(shipmentId: string, data: Partial<IShipment>): Promise<IShipment | null> {
        const found = await this.shipmentModel.findByPk(shipmentId);
        if (!found) return null;
        const updated = await found.update(data);
        return updated;
    }
}

export const shipmentRepository = new PostgresShipmentRepository();