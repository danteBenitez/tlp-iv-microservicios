import { createSlice } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

type SocketState = {
    socket: Socket | null,
    online: boolean
}

const initialState: SocketState = {
    socket: null,
    online: false
}

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        connect(state) {
            state.online = true;
            console.log("Conectando a socket...");
            const url = new URL(import.meta.env.VITE_API_BASE_URL).host;
            // @ts-expect-error TypeScript da un error de tipo 
            // aunque io() retorne una instancia de Socket, como es de esperar
            state.socket = io(url, {
                autoConnect: true,
                path: "/api/websocket",
            })
            console.log("Conectando a socket...", state.socket);
        },
        disconnect(state) {
            state.online = false;
            state.socket = null;
        }
    },
});

export const {
    connect,
    disconnect
} = socketSlice.actions;


export default socketSlice.reducer;
