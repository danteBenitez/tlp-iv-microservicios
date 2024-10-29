import { config } from "../config/config.service";
import { IUser } from "../interfaces/user.interface";

export class UsersService {
    token: string | null = null

    constructor(
        private serviceUrl = config.getUserServiceUrl(),
        private credentials = config.getUserServiceCredentials()
    ) { }

    // TODO: Refactorizar la lógica de reintento
    async getToken() {
        const fullUrl = new URL("/login", this.serviceUrl);
        const response = await this.request(fullUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: this.credentials.username,
                password: this.credentials.password
            }),
        });

        if (response.status != 200) {
            throw new Error("Error al autenticar servicio de usuarios: Credenciales incorrectas");
        }

        return response.json()
            .then(({ token }) => {
                console.log("Getting token...");
                return token;
            })
            .catch(async () => {
                throw new Error("Error al autenticar con servicio de usuarios" + await response.json())
            })
    }

    private async request(url: string | URL, options?: RequestInit) {
        const fullUrl = new URL(url, this.serviceUrl);
        return fetch(fullUrl, {
            ...options,
        })
    }

    private async requestWithAuth(url: string, options?: RequestInit): Promise<Response> {
        const fullUrl = new URL(url, this.serviceUrl);
        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                ...options?.headers ?? {},
                Authorization: `Bearer ${this.token}`,
            },
        });

        if (response.status == 401) {
            this.token = null;
            this.token = await this.getToken();
            return this.requestWithAuth(url, options);
        }

        return response;
    }

    async findById(userId: number): Promise<IUser | null> {
        const response = await this.requestWithAuth(`/users/${userId}`);
        if (response.status != 200) {
            return null;
        }
        return (await response.json()).user as IUser;
    }
}

export const usersService = new UsersService();