import path from "path";
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { Database } from ".";
import { config as configService } from "../config/config.service.js";
import { seedRoles } from "./seed/roles.seeder";

export class SequelizeDatabase implements Database {
    private static instance: Database | null = null
    private static config = configService.getDatabaseOptions()

    private constructor(
        private sequelize: Sequelize
    ) { }

    static getConnection() {
        if (!SequelizeDatabase.instance) {
            const config = SequelizeDatabase.config;
            const sequelize = new Sequelize(config.NAME, config.USER, config.PASSWORD, {
                dialect: config.DIALECT as Dialect,
                host: config.HOST,
                port: config.PORT,
                database: config.NAME,
                models: [path.resolve('dist/models/*.model.js')]
            });
            SequelizeDatabase.instance = new SequelizeDatabase(sequelize)
        }
        return SequelizeDatabase.instance;
    }

    async sync(opts: { force: boolean }): Promise<void> {
        await this.sequelize.sync(opts);
    }

    async setup(): Promise<void> {
        await this.sync({ force: false });
        await this.seedDatabase();
        await this.checkConnection();
    }

    private async seedDatabase(): Promise<void> {
        await seedRoles();
    }

    async close(): Promise<void> {
        return this.sequelize.close();
    }

    async checkConnection() {
        return this.sequelize.authenticate();
    }
}