import BigInteger from 'bigi';

import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Client } from "@runeserver-ts/game/client/Client";
import { Server } from "@runeserver-ts/Server";
import { ISAACCipher } from "@runeserver-ts/net/ISAACCipher";;

export interface ClientLoginRequestResponse {
    status: boolean;
    userId: number;
    username: string;
    password: string;
}

export class ClientLoginRequest {
    public static Parse(client: Client, buffer: StreamBuffer): ClientLoginRequestResponse {
        if(!buffer) {
            throw ('No data supplied for login');
        }

        const loginType = buffer.readUnsignedByte();
        console.log("loginType", loginType);

        if(loginType !== 16 && loginType !== 18) {
            throw ('Invalid login type ' + loginType);
        }

        let loginEncryptedSize = buffer.readUnsignedByte() - (36 + 1 + 1 + 2);
        console.log("loginEncryptedSize", loginEncryptedSize);

        if(loginEncryptedSize <= 0) {
            throw ('Invalid login packet length ' + loginEncryptedSize);
        }

        const packetId = buffer.readUnsignedByte();
        console.log("packetId", packetId);

        if(packetId !== 255) {
            throw ('Invalid login packet id ' + packetId);
        }

        const gameVersion = buffer.readUnsignedShortBE();
        console.log("gameVersion", gameVersion);

        if(gameVersion !== 377) {
            throw ('Invalid game version ' + gameVersion);
        }

        const isLowDetail: boolean = buffer.readByte() === 1;
        console.log("isLowDetail", isLowDetail);

        for(let i = 0; i < 9; i++) {
            buffer.readIntBE(); // Cache indices
        }

        loginEncryptedSize--;

        const reportedSize = buffer.readUnsignedByte();
        console.log("reportedSize", reportedSize);

        if(loginEncryptedSize !== reportedSize) {
            throw (`Packet size mismatch - ${loginEncryptedSize} vs ${reportedSize}`);
        }

        const encryptedBytes: Buffer = Buffer.alloc(loginEncryptedSize);
        buffer.getBuffer().copy(encryptedBytes, 0, buffer.getReaderIndex());

        const rsaModulus = BigInteger(Server.getInstance().getSettings().rsaModulus);
        const rsaExponent = BigInteger(Server.getInstance().getSettings().rsaExponent);
        const decrypted: StreamBuffer = new StreamBuffer(BigInteger.fromBuffer(encryptedBytes).modPow(rsaExponent, rsaModulus).toBuffer());

        const rsaOpcode = decrypted.readByte();
        console.log("rsaOpcode", rsaOpcode);
        
        if(rsaOpcode !== 10) {
            console.log("dec", decrypted.getBuffer())
            throw ('Invalid block id ' + rsaOpcode);
        }

        const clientKey1 = decrypted.readIntBE();
        const clientKey2 = decrypted.readIntBE();
        const incomingServerKey = decrypted.readLongBE();
        
        console.log("clientKey1", clientKey1);
        console.log("clientKey2", clientKey2);
        console.log("incomingServerKey", incomingServerKey);

        const serverKey = BigInt(Server.getInstance().getSettings().serverKey);
        console.log(serverKey, incomingServerKey)
        if(serverKey !== incomingServerKey) {
            throw (`Server key mismatch - ${serverKey} != ${incomingServerKey}`);
        }

        const sessionKey: number[] = [
            Number(clientKey1), Number(clientKey2), Number(serverKey >> BigInt(32)), Number(serverKey)
        ];

        client.setDecryptor(new ISAACCipher(sessionKey));

        for(let i = 0; i < 4; i++) {
            sessionKey[i] += 50;
        }

        client.setEncryptor(new ISAACCipher(sessionKey));

        const userId = decrypted.readIntBE();
        const username = decrypted.readString();
        const password = decrypted.readString();

        console.log("userId", userId);
        console.log("username", username);
        console.log("password", password);

        return {
            status: true,
            userId: userId,
            username: username,
            password: password
        };
    }
}