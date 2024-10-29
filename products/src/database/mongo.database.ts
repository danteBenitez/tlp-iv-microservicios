import mongoose, { Mongoose } from "mongoose";
import { Database } from ".";
import { config as configService } from "../config/config.service.js";

export class MongoDatabase implements Database {
    private static instance: MongoDatabase | null = null
    private static config = configService.getDatabaseOptions()

    private constructor(
        private mongoose: Mongoose
    ) { }

    static getConnection(): MongoDatabase {
        if (!MongoDatabase.instance) {
            MongoDatabase.instance = new MongoDatabase(mongoose)
        }
        return MongoDatabase.instance!;
    }

    async sync(opts: { force: boolean }): Promise<void> {
        // Mongoose crea una colección cuando hay una inserción, de modo automático,
        // así que la sincronización no realiza ninguna tarea
    }

    async setup(): Promise<void> {
        await this.checkConnection();
    }


    async close(): Promise<void> {
        return this.mongoose.disconnect();
    }


    async checkConnection() {
        const config = MongoDatabase.config;
        const url = `mongodb://${config.USER}:${config.PASSWORD}@${config.HOST}:${config.PORT}/${config.NAME}?authSource=admin`;
        await this.mongoose.connect(url, {
            autoCreate: true,
        });
    }

}