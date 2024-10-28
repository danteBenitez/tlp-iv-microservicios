import { Optional } from "sequelize";
import { Column, HasMany, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ISale } from "../interfaces/sale.interface.js";
import SaleDetail from "./sale-detail.model.js";

interface SaleCreationAttribute extends Optional<ISale, 'saleId'> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'sales',
    underscored: true
})
export default class Sale extends Model<ISale, SaleCreationAttribute> {

    @IsUUID("4")
    @PrimaryKey
    @Column({
        field: "sale_id"
    })
    declare saleId: string;

    @Column
    declare dateSale: Date;

    @Column
    declare userId: string;

    @HasMany(() => SaleDetail)
    declare details: SaleDetail[]
}