import { Op } from "sequelize";
import { RoleName } from "../constants/roles.constant";
import { IUser } from "../interfaces/user.interface";
import Role from "../models/role.model";
import UserRole from "../models/user-roles.model";
import User from "../models/user.model";

export interface IUserRepository {
    /** Retorna un usuario por ID junto con su {@link Role} asociado */
    findById(userId: number): Promise<IUser | null>

    findByUsername(username: string): Promise<IUser | null>

    /** Retorna todos los usuarios por ID junto con su {@link Role} asociado */
    findAll(): Promise<IUser[]>

    /** 
     * Retorna un usuario cuyo `email` o `username` coincidan con los pasados 
     * Excluye de la búsqueda usuario con `userId`.
     * */
    findExcluding(userId: number, username: string | undefined, email: string | undefined): Promise<IUser | null>


    /** 
     * Retorna un usuario cuyo `email` o `username` coincidan con los pasados 
     * */
    findMatching(username: string | undefined, email: string | undefined): Promise<IUser | null>

    /**
     * Remueve todos los roles del usuario pasado
     * @param userId 
     */
    removeAllRoles(userId: number): Promise<void>

    hasRole(userId: number, roleName: RoleName): Promise<boolean>

    /**
     * Actualiza todos los roles del usuario, sobreescribiendo a los 
     * actuales.
     * @param userId 
     */
    overwriteAllRoles(user: IUser, roleNames: RoleName[]): Promise<void>

    update(userId: number, user: Partial<IUser>): Promise<IUser | null>

    create(userData: Omit<IUser, "userId">): Promise<IUser>
    delete(userId: number): Promise<IUser | null>
}

export class PostgresRepository implements IUserRepository {

    constructor(
        private userModel: typeof User = User,
        private roleModel: typeof Role = Role,
        private userRoleModel: typeof UserRole = UserRole
    ) { }

    findById(userId: number): Promise<IUser | null> {
        return this.userModel.findByPk(userId, {
            include: [this.roleModel]
        });
    }

    findByUsername(username: string): Promise<IUser | null> {
        return this.userModel.findOne({
            where: { username }
        });
    }


    findAll(): Promise<IUser[]> {
        return this.userModel.findAll({
            attributes: {
                exclude: ["password"]
            },
            include: [this.roleModel]
        })
    }

    findExcluding(userId: number, username: string | undefined, email: string | undefined): Promise<IUser | null> {
        return this.userModel.findOne({
            where: {
                userId: { [Op.ne]: userId },
                [Op.or]: {
                    username: username ?? "",
                    email: email ?? "",
                },
            },
        })
    }

    async removeAllRoles(userId: number): Promise<void> {
        await this.userRoleModel.destroy({
            where: { userId },
            force: true
        })
    }

    async overwriteAllRoles(user: User, roleNames: RoleName[]): Promise<void> {
        const roles = await this.roleModel.findAll({
            where: { name: { [Op.or]: roleNames } },
        });
        await user.$set("roles", roles);
    }

    create(userData: Omit<IUser, "userId">): Promise<IUser> {
        return this.userModel.create(
            {
                username: userData.username,
                password: userData.password,
                email: userData.email,
                roles: []
            },
            {
                attributes: {
                    exclude: ["password"],
                },
                include: this.roleModel,
            }
        );
    }

    findMatching(username: string | undefined, email: string | undefined): Promise<IUser | null> {
        return this.userModel.findOne({
            where: {
                [Op.or]: {
                    username: username,
                    email: email,
                },
            },

        })
    }

    async hasRole(userId: number, roleName: RoleName) {
        const role = await this.roleModel.findOne({
            where: { name: roleName }
        });
        return role?.$has("users", userId) ?? false
    }

    async delete(userId: number): Promise<IUser | null> {
        const found = await this.userModel.findByPk(userId);
        if (!found) return null;
        await found.destroy();
        return found;
    }

    async update(userId: number, user: Partial<IUser>): Promise<IUser | null> {
        const found = await this.userModel.findByPk(userId, {
            include: [this.roleModel]
        });
        if (!found) return null;

        if (user.roles) {
            const roles = await this.roleModel.findAll({
                where: { name: { [Op.or]: user.roles.map(role => role.name) } },
            });
            await found.$set('roles', roles);
        }
        await found.update(user);
        return this.findById(userId);
    }
}

export const userRepository = new PostgresRepository();