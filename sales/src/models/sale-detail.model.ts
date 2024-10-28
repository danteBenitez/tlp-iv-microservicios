import { Optional } from "sequelize";
import { Column, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ISaleDetail } from "../interfaces/sale-detail.interface..js";
import Sale from "./sale.model.js";

interface SaleDetailCreationAttributes extends Optional<ISaleDetail, 'saleDetailId'> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'sale_detail',
    underscored: true
})
export default class SaleDetail extends Model<ISaleDetail, SaleDetailCreationAttributes> {

    @IsUUID("4")
    @PrimaryKey
    @Column({
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