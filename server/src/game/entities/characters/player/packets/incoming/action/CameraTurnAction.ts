import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";

export class CameraTurnAction {
    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        // Nothing to do
    }
}