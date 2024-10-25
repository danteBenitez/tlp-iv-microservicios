import { Optional } from "sequelize";
import { AutoIncrement, BelongsToMany, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IRole } from "../interfaces/role.interface.js";
import UserRole from "./user-roles.model.js";
import User from "./user.model.js";

interface RoleCreationAttributes extends Optional<IRole, "roleId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'roles',
    underscored: true
})
export default class Role extends Model<IRole, RoleCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare roleId: number;

    @Column
    declare name: string;

    @BelongsToMany(() => User, {
        through: {
            model: () => UserRole,
            unique: false
        }
    })
    declare users: User[]
}