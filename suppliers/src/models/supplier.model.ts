import { Optional } from "sequelize";
import { AutoIncrement, BelongsToMany, Column, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ISupplier } from "../interfaces/supplier.interface";


interface SupplierCreationAttributes extends Optional<ISupplier, 'supplierId'> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'suppliers',
    underscored: true
})
export default class Supplier extends Model<ISupplier, SupplierCreationAttributes> {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        field: "supplier_id"
    })
    declare supplierId: string;
    
    @Column({
        field: "company_name"
    })
    declare companyName: string;

    @Column({
        field: "cuit"
    })
    declare cuit: string;

    @Column({
        field: "phone_number"
    })
    declare phoneNumber: string;

    @Column({
        field: "address"
    })
    declare address: string;

    @Column({
        field: "email"
    })
    declare email: string;
}