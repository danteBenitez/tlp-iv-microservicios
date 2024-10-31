import { connect } from "amqplib";
import { Channel, Message } from "amqplib/callback_api";
import { config } from "../config/config.service";

type MessageHandler = (msg: Message | null) => void

export class BrokerAdapter {
    private channel: Channel
    private onConnectionCallbacks: Record<string, MessageHandler[]> = {}

    sendToQueue(queueName: string, data: object) {
        this.channel.assertQueue(queueName, {
            durable: false
        });
        this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    }

    consume(queueName: string, onConnectionCallback: MessageHandler) {
        this.channel.assertQueue(queueName, {
            durable: false
        });
        if (!this.channel) {
            // Si todavía no existe un canal, guardamos el manejador aquí
            // luego activarlo
            if (this.onConnectionCallbacks[queueName]) {
                this.onConnectionCallbacks[queueName].push(onConnectionCallback);
            }
            this.onConnectionCallbacks[queueName] = [onConnectionCallback];
        }
        this.channel.consume(queueName, onConnectionCallback);
    }

    async connect() {
        const options = config.getMessageBrokerOptions();
        const connection = await connect({
            password: options.PASSWORD,
            username: options.USERNAME,
            hostname: options.URL
        })
        const channel = await connection.createChannel();
        for (const queue in this.onConnectionCallbacks) {
            for (const callback of this.onConnectionCallbacks[queue]) {
                console.log("Setting consumer...");
                this.channel.consume(queue, callback);
            }
        }
        this.channel = channel;
    }
}

export const messageBrokerAdapter = new BrokerAdapter();