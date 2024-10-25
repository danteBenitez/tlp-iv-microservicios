import { Optional } from "sequelize";
import { AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IUserRole } from "../interfaces/user-role.interface.js";
import Role from "./role.model.js";
import User from "./user.model.js";

interface UserRoleCreationAttributes extends Optional<IUserRole, "userRoleId"> { }

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'user_roles',
    underscored: true
})
export default class UserRole extends Model<IUserRole, UserRoleCreationAttributes> {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare userRoleId: number;

    @Column
    @ForeignKey(() => Role)
    declare roleId: number

    @Column
    @ForeignKey(() => User)
    declare userId: number
}