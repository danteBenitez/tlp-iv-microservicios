import { MongoDatabase } from "./mongo.database";

export interface Database {
    sync(opts: { force: boolean }): Promise<void>;
    close(): Promise<void>;
    checkConnection(): Promise<void>
    /**
     * Hace tareas de inicialización al momento de iniciar la aplicación.
     * No debería iniciar 
     */
    setup(): Promise<void>
}

export const database: Database = MongoDatabase.getConnection()