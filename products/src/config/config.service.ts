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
    USER_SERVICE: {
        URL: string,
        USERNAME: string,
        PASSWORD: string
    }
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
            USER_SERVICE: {
                URL: getEnvOrFail("USER_SERVICE_URL"),
                USERNAME: getEnvOrFail("USER_SERVICE_USERNAME"),
                PASSWORD: getEnvOrFail("USER_SERVICE_PASSWORD")
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

    getUserServiceUrl() {
        return this.config.USER_SERVICE.URL;
    }

    getUserServiceCredentials() {
        const { USERNAME: username, PASSWORD: password } = this.config.USER_SERVICE;
        return { username, password };
    }
}

export const config = ConfigService.fromEnv();