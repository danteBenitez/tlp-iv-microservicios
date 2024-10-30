import { Optional } from "sequelize";
import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IPurchase } from "../interfaces/purchase.interface.js";
import PurchaseDetail from "./purchase-detail.model.js";

interface PurchaseCreationAttribute extends Optional<IPurchase, 'purchaseId'> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'purchases',
    underscored: true
})
export default class Purchase extends Model<IPurchase, PurchaseCreationAttribute> {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        field: "purchase_id"
    })
    declare purchaseId: string;

    @Column
    declare datePurchase: Date;

    @Column
    declare supplierId: string;

    @HasMany(() => PurchaseDetail)
    declare details: PurchaseDetail[]
}