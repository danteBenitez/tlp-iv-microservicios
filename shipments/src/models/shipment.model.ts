import { Optional } from "sequelize";
import { Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";
import { SHIPMENT_STATUS_LIST, ShipmentStatus } from "../constants/shipment-status.constant.js";
import { IShipment } from "../interface/shipment.interface.js";

interface ShipmentCreationAttributes extends Optional<IShipment, 'shipmentId'> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'shipments',
    underscored: true
})
export default class Shipment extends Model<IShipment, ShipmentCreationAttributes> {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        field: "shipment_id"
    })
    declare shipmentId: string;

    @Column
    declare address: string

    @Column({ type: DataType.ENUM(...SHIPMENT_STATUS_LIST) })
    declare status: ShipmentStatus

    @Column
    declare userId: string

    @Column
    declare saleId: string
}