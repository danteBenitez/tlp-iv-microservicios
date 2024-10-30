import { Optional } from "sequelize";
import { Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Sale from "./purchase.model.js";
import { IPurchaseDetail } from "../interfaces/purchase-detail.interface.js";
import Purchase from "./purchase.model.js";

interface PurchaseDetailCreationAttributes extends Optional<IPurchaseDetail, 'purchaseDetailId'> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'purchase_detail',
    underscored: true
})
export default class PurchaseDetail extends Model<IPurchaseDetail, PurchaseDetailCreationAttributes> {

    @Default(DataType.UUIDV4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        field: "purchase_detail_id"
    })
    declare purchaseDetailId: string;

    @Column
    declare quantity: number;

    @Column
    declare costPrice: number

    @Column(DataType.UUID)
    @ForeignKey(() => Purchase)
    declare purchaseId: string

    @Column
    declare productId: string

}