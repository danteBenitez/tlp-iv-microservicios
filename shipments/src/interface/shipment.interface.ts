import { ShipmentStatus } from "../constants/shipment-status.constant";

export interface IShipment {
    shipmentId: string,
    address: string,
    status: ShipmentStatus,
    userId: string,
    saleId: string
}