import { WebSocketClient } from "./WebSocketClient";

export class Socket {
    host: string;
    port: number;
    client: WebSocketClient;
    lastArrayBufferReceived: Int8Array = null;
    lastArrayBufferReadIndex: number = 0;

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
        this.client = new WebSocketClient();
    }

    public async connect() {
        await this.client.connect(`ws://${this.host}:${this.port}`);
    }

    public write$int(buf: number) {
        this.client.send(new Int8Array([buf]));
    }

    public write$byte_A$int$int(bytes: number[] | Int8Array, off: number, len: number) {
        if (bytes instanceof Int8Array) {
            this.client.send(bytes.slice(off, off + len));
        } else {
            this.client.send(new Int8Array(bytes.slice(off, off + len)));
        }
    }

    public write$byte_A(bytes: number[] | Int8Array) {
        if (bytes instanceof Int8Array) {
            this.client.send(bytes.slice);
        } else {
            this.client.send(new Int8Array(bytes));
        }
    }

    public async read(): Promise<number> {
        if (this.lastArrayBufferReceived != null && this.lastArrayBufferReadIndex < this.lastArrayBufferReceived.length) {
            // if last byte in array then reset lastArrayBufferReadIndex
            return this.readFromLastArray();
        }
        const received = await this.client.receive();
        if (received instanceof Error) {
            throw received;
        }
        this.lastArrayBufferReceived = new Int8Array(received);
        this.lastArrayBufferReadIndex = 0;
        return this.readFromLastArray();
    }

    readFromLastArray(): number {
        // if last byte in array then reset lastArrayBufferReadIndex
        if (this.lastArrayBufferReadIndex == this.lastArrayBufferReceived.length - 1) {
            const lastByte = this.lastArrayBufferReceived[this.lastArrayBufferReadIndex];
            this.lastArrayBufferReadIndex = 0;
            this.lastArrayBufferReceived = null;
            return lastByte;
        }
        return this.lastArrayBufferReceived[this.lastArrayBufferReadIndex++];
    }

    public async read$byte_A$int$int(b: number[] | Int8Array, off: number, len: number): Promise<number> {
        let c = await this.read();
        b[off] = c;
        let i = 1;
        for (; i < len; i++) {
            c = await this.read();
            b[off + i] = c;
        }
        return i;
    }

    public async close() {
        console.warn("closed")
        await this.client.disconnect();
    }

    public available(): number {
        return this.client.dataBytesAvailable;
    }
}
