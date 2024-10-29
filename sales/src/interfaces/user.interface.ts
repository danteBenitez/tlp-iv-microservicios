import { RoleName } from "../constants/role.constant";

export interface IUser {
    userId: number;
    username: string;
    password: string;
    email: string;
    roles: {
        name: RoleName
    }[]
}