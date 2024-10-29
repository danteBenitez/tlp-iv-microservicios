import { SequelizeDatabase } from "./sql.database";

export interface Database {
    sync(opts: { force: boolean }): Promise<void>;
    close(): Promise<void>;
    checkConnection(): Promise<void>
    setup(): Promise<void>
}

export const database: Database = SequelizeDatabase.getConnection()