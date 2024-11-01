import * as jwt from "jsonwebtoken";
import { config } from "../config/config.service";
import { ROLES } from "../constants/roles.constant";
import { IUser } from "../interfaces/user.interface";
import { CreateUserData, SignInData } from "../validations/user.schema";
import { EncryptionService, encryptionService as encryptionService_ } from "./encryption.service";
import { ConflictingUserError, InvalidSignInError, SafeUser, usersService, UsersService } from "./user.service";

export class AuthService {

    constructor(
        private userService: UsersService = usersService,
        private encryptionService: EncryptionService = encryptionService_
    ) { }

    /**
     * Regístra un usuario con un rol de usuario 
     */
    async signUp(userData: CreateUserData) {
        const user = await this.userService.findMatching(userData.username, userData.password);

        if (user) {
            throw new ConflictingUserError(
                "Nombre de usuario o correo electrónico en uso"
            );
        }

        const signedUp = await this.userService.create(
            {
                username: userData.username,
                password: userData.password,
                email: userData.email,
                roles: [ROLES.USER]
            },
        );

        return {
            user: signedUp.user,
            token: await this.createTokenFor(signedUp.user),
        };
    }

    createTokenFor(user: IUser) {
        return jwt.sign({ userId: user.userId }, config.getSecret());
    }

    /**
     * Inicia sesión a un usuario existente
     *
     * @param {{
     *    username: string,
     *    password: string,
     * }} userData
     */
    async signIn(userData: SignInData) {
        const found = await this.userService.findByUsername(userData.username);

        if (!found) {
            throw new InvalidSignInError("Usuario o contraseña no válida");
        }

        const passwordsMatches = await this.encryptionService.compare(
            userData.password,
            found.password
        );

        if (!passwordsMatches) {
            throw new InvalidSignInError("Usuario o contraseña no válida");
        }

        (found as SafeUser).password = undefined;

        return {
            user: found,
            token: await this.createTokenFor(found)
        };
    }
}

export const authService = new AuthService();