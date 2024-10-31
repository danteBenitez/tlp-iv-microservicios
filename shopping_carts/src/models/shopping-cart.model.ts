import { Optional } from "sequelize";
import { Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ICart } from "../interfaces/cart.interface";

interface ShoppintCartCreationAttributes extends Optional<ICart, 'cartId'> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'shopping_cart',
    underscored: true
})
export default class ShoppingCart extends Model<ICart, ShoppintCartCreationAttributes> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        field: "cart_id"
    })
    declare cartId: string;

    @Column
    declare quantity: number;

    @Column
    declare productId: string;

    @Column
    declare userId: string;
}