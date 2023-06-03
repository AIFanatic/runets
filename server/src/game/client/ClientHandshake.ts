import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Client } from "@runeserver-ts/game/client/Client";

export interface ClientHandshakeResponse {
    status: boolean;
};

export class ClientHandshake {
    public static Parse(client: Client, buffer: StreamBuffer): ClientHandshakeResponse {
        if(!buffer) {
            throw ('No data supplied for client handshake');
        }
        
        const handshakePacketId = buffer.readUnsignedByte();
        
        if (handshakePacketId != 14) {
            console.error("Invalid login request");
            client.disconnect();
            return {status: false};
        }

        // Write the response.
        const out = StreamBuffer.create();
        for(let i = 0; i < 8; i++) {
            out.writeByte(0); // First 8 bytes are ignored by the client.
        }
        out.writeByte(0); // The response opcode, 0 for logging in.
        out.writeLongBE(BigInt(65537));
        client.getSocketChannel().send(out.getData());

        return {status: true};
    }
}