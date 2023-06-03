import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";

interface MouseClickedRequest {
    delay: number;
    right: boolean;
    x: number;
    y: number;
}

export class MouseClicked {
    private static ParseRequest(packetId: number, packetSize: number, buffer: StreamBuffer): MouseClickedRequest {
        const value = buffer.readIntBE();

        const delay = (value >> 20) * 50;
		const right = (value >> 19 & 0x1) == 1;

		const cords = value & 0x3FFFF;
		const x = cords % 765;
		const y = cords / 765;

        return {
            delay: delay,
            right: right,
            x: x,
            y: y
        }
    }

    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        const mouseClickedRequest = MouseClicked.ParseRequest(packetId, packetSize, buffer);
        // console.log("MouseClicked request", mouseClickedRequest);
    }
}