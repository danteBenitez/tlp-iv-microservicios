import bcrypt from "bcrypt";
import { config } from "../config/config.service.js";

export class EncryptionService {
    /**
     * Encripta el string pasado como parámetro
     * 
     * @param {string} data
     */
    async encrypt(data: string) {
        return bcrypt.hash(data, config.getSalt());
    }

    /**
     * Compara un valor plano con un valor encriptado
     */
    async compare(plain: string, encrypted: string): Promise<boolean> {
        return bcrypt.compare(plain, encrypted);
    }
}

export const encryptionService = new EncryptionService();