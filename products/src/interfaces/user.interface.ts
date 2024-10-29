import { IRole } from "./role.interface.js";

export interface IUser {
    userId: number;
    username: string;
    password: string;
    email: string;
    roles: IRole[];
}