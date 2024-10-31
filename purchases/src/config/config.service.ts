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
        DIALECT: string;
        SHOULD_FORCE: boolean;
    },
    PRODUCT_SERVICE: {
        URL: string,
    },
    SUPPLIER_SERVICE: {
        URL: string,
    },
    USER_SERVICE: {
        URL: string,
        USERNAME: string,
        PASSWORD: string
    },
    PORT: string,
    SALT_ROUNDS: number,
    SECRET: string
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
                DIALECT: getEnvOrFail("DB_DIALECT"),
                SHOULD_FORCE: process.env.NODE_ENV !== "production" && process.argv[2] == "force"
            },
            PRODUCT_SERVICE: {
                URL: getEnvOrFail("PRODUCT_SERVICE_URL"),
            },
            SUPPLIER_SERVICE: {
                URL: getEnvOrFail("SUPPLIER_SERVICE_URL"),
            },
            USER_SERVICE: {
                URL: getEnvOrFail("USER_SERVICE_URL"),
                USERNAME: getEnvOrFail("USER_SERVICE_USERNAME"),
                PASSWORD: getEnvOrFail("USER_SERVICE_PASSWORD"),
            },
            PORT: getEnvOrFail("PORT"),
            SALT_ROUNDS: parseInt(getEnvOrFail("SALT_ROUNDS")),
            SECRET: getEnvOrFail("JWT_SECRET")
        };
        const service = new ConfigService(config);
        return service;
    }


    getSecret() {
        return this.config["SECRET"];
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
        return {
            username,
            password
        };
    }

    getProductServiceUrl() {
        return this.config.PRODUCT_SERVICE.URL;
    }

    getSupplierServiceUrl() {
        return this.config.SUPPLIER_SERVICE.URL;
    }
}

export const config = ConfigService.fromEnv();