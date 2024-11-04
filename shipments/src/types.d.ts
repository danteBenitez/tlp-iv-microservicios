import { IUser } from "./interface/user.interface.js";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}