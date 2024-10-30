export const SHIPMENT_STATUS = {
    IN_STOCK: "stock",
    DELIVERED: "delivered",
    TRAVELING: "traveling"
} as const;

export type ShipmentStatus = typeof SHIPMENT_STATUS[keyof typeof SHIPMENT_STATUS];

export const SHIPMENT_STATUS_LIST = [SHIPMENT_STATUS.IN_STOCK, SHIPMENT_STATUS.DELIVERED, SHIPMENT_STATUS.TRAVELING];