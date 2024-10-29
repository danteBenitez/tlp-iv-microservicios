import { Optional } from "sequelize";
import { Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ISaleDetail } from "../interfaces/sale-detail.interface.js";
import Sale from "./sale.model.js";

interface SaleDetailCreationAttributes extends Optional<ISaleDetail, 'saleDetailId'> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'sale_detail',
    underscored: true
})
export default class SaleDetail extends Model<ISaleDetail, SaleDetailCreationAttributes> {

    @Default(DataType.UUIDV4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        field: "sale_detail_id"
    })
    declare saleDetailId: string;

    @Column
    declare quantity: number;

    @Column
    declare sellPrice: number

    @Column
    @ForeignKey(() => Sale)
    declare saleId: string

    @Column
    declare productId: string

}