import { IShipment } from "../interface/shipment.interface";

export class NewShipmentEvent {
    static type = "shipment.new"

    constructor(public shipment: IShipment) { }
}

export class ShipmentStatusChanged {
    static type = "shipment.changed"

    constructor(public shipment: IShipment) { }
}