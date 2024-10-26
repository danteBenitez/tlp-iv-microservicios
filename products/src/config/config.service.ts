/**
 * Función auxiliar que arroja un error de mensaje claro cuando una variable de entorno
 * está ausente.
 * 
 * @param {string} key
 */
const getEnvOrFail = (key: string) => {
    const value = process.env[key];
    if (value == null) {
        throw new Error(`Variable de entorno ${key} faltante.`);
    }
    return value;
}

type ApplicationConfig = {
    DATABASE: {
        HOST: string;
        PORT: number;
        USER: string;
        PASSWORD: string;
        NAME: string;
    },
    PORT: string,
    SALT_ROUNDS: number,
}

class ConfigService {
    private constructor(
        private config: ApplicationConfig
    ) { }

    static fromEnv(): ConfigService {
        const config = {
            DATABASE: {
                HOST: getEnvOrFail("DB_HOST"),
                PORT: parseInt(getEnvOrFail("DB_PORT")),
                USER: getEnvOrFail("DB_USER"),
                PASSWORD: getEnvOrFail("DB_PASSWORD"),
                NAME: getEnvOrFail("DB_NAME"),
            },
            PORT: getEnvOrFail("PORT"),
            SALT_ROUNDS: parseInt(getEnvOrFail("SALT_ROUNDS")),
        };
        const service = new ConfigService(config);
        return service;
    }

    getSalt() {
        return this.config["SALT_ROUNDS"];
    }

    getDatabaseOptions() {
        return this.config["DATABASE"];
    }

    getServerPort() {
        return parseInt(this.config["PORT"]);
    }
}

export const config = ConfigService.fromEnv();