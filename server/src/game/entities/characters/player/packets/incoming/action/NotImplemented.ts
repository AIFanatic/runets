import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/character/player/Player";

export class NotImplemented {
    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        console.log(`[TODO] handlePacket id: ${packetId}, size: ${packetSize}`);
    }
}