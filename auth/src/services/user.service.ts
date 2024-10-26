import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { z } from "zod";
import { config } from "../config/config.service.js";
import { RoleName } from "../constants/roles.constant.js";
import { IUser } from "../interfaces/user.interface.js";
import User from "../models/user.model.js";
import { IUserRepository } from "../repositories/user.repository.js";
import { CreateUserByAdmin, UpdateUserByAdmin, UpdateUserData } from "../validations/user.schema.js";
import { EncryptionService } from "./encryption.service.js";

export class ConflictingUserError extends Error { }
export class UserNotFoundError extends Error { }
export class InvalidSignInError extends Error { }
export class InvalidRoleError extends Error { }
export class InvalidDataError extends Error { }

export type SafeUser = Omit<IUser, "password"> & { password?: string };

export class UsersService {
    constructor(
        private userRepository: IUserRepository = userRepository,
        private encryptionService: EncryptionService = encryptionService,
    ) { }

    /**
     * Crea un JWT para el usuario pasado como parámetro
     * @param {User} user
     */
    async createTokenFor(user: IUser) {
        return new Promise((resolve, reject) => {
            jwt.sign({ userId: user.userId }, config.getSecret(), (err: Error | null, data: string | undefined) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }

    /**
     * Encuentra un usuario dado un JWT
     *
     * @param {string} token
     * @returns {Promise<User | null>} Retorna el usuario o
     * null si no se puede verificar el token.
     */
    async findForToken(token: string) {
        try {
            const data = await new Promise((resolve, reject) =>
                jwt.verify(token, config.getSecret(), (err, data) => {
                    if (err) reject(err);
                    else resolve(data);
                })
            );
            const { userId } = z.object({
                userId: z.number()
            }).parse(data);
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return null;
            }
            delete (user as SafeUser).password;
            const { password, ...userData } = user;
            return userData;
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                console.error("Error al verificar JWT: ", err);
            }
            return null;
        }
    }

    /**
     * Encuentra y retorna todos los usuarios.
     *
     */
    async findAll(): Promise<IUser[]> {
        const users = await this.userRepository.findAll();
        return users;
    }

    /**
     * Encuentra y retorna un usuario por su ID
     */
    async findById(userId: number) {
        const user = await this.userRepository.findById(userId);
        return user;
    }

    /**
     * Actualiza un usuario con datos parciales.
     */
    async updateByAdmin(userId: number, userData: UpdateUserByAdmin) {
        if ("password" in userData) {
            throw new InvalidDataError("No puedes actualizar la contraseña de otro usuario");
        }
        return this.updateUser(userId, userData);
    }

    /**
     * Actualiza un usuario con datos parciales.
     * Este servicio permite que un usuario actualice su propio perfil, 
     * incluyendo su contraseña.
     * 
     * **No** permite que cambie sus roles.
     */
    async updateProfile(userId: number, userData: UpdateUserData) {
        if ("roles" in userData) {
            throw new InvalidRoleError("No puedes asignarte un rol a ti mismo");
        }
        return this.updateUser(userId, userData);
    }

    private async updateUser(userId: number, userData: UpdateUserByAdmin | UpdateUserData) {
        const found = await this.userRepository.findById(userId);
        if (!found) {
            throw new UserNotFoundError("Usuario no encontrado.");
        }

        const otherUser = await this.userRepository.findExcluding(userId, userData.username, userData.email);

        if (otherUser) {
            throw new ConflictingUserError("Nombre de usuario o email en uso");
        }


        if ("roles" in userData && userData.roles) {
            if (userData.roles.length === 0) {
                await this.userRepository.removeAllRoles(userId);
            } else {
                await this.userRepository.overwriteAllRoles(found, userData.roles);
            }

        }

        let password = found.password;
        if ("password" in userData && userData.password) {
            password = await this.encryptionService.encrypt(userData.password);
        }

        const user = await this.userRepository.update(found.userId, {
            email: userData.email,
            username: userData.username,
            password: password
        })
        delete (user as SafeUser).password;

        if (!user) {
            throw new UserNotFoundError("Usuario no encontrado");
        }
        return user;
    }

    /**
     * Borra un usuario con el ID pasado
     */
    async delete(id: number) {
        return this.userRepository.delete(id);
    }

    async findMatching(username: string, email: string): Promise<IUser | null> {
        const user = await this.userRepository.findMatching(username, email);
        return user;
    }

    async create(userData: CreateUserByAdmin) {
        const user = await this.userRepository.findMatching(userData.username, userData.email);

        if (user) {
            throw new ConflictingUserError(
                "Nombre de usuario o correo electrónico en uso"
            );
        }
        userData.password = await this.encryptionService.encrypt(userData.password);

        const signedUp = await this.userRepository.create({ ...userData, roles: [] });

        if (userData.roles && userData.roles.length !== 0) {
            await this.userRepository.overwriteAllRoles(signedUp, userData.roles);
        }

        delete (signedUp as SafeUser).password;

        return {
            user: signedUp,
        };
    }


    /**
     * Verifica si el usuario tiene el un rol con el nombre
     * dado por el parámetro `role`
     */
    async matchesRole(user: User, roleName: RoleName) {
        return this.userRepository.hasRole(user.userId, roleName);
    }

    async findByUsername(username: string) {
        return this.userRepository.findByUsername(username);
    }
}

export const usersService = new UsersService();