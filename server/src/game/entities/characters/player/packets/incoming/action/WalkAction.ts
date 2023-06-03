import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Position } from "@runeserver-ts/game/entities/Position";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";

export class WalkAction {
    private static ParseRequest(packetId: number, packetSize: number, buffer: StreamBuffer): Position[] {
        let size = packetSize;

        if(packetId === 213) {
            size -= 14;
        }
    
        const output: Position[] = [];

        const totalSteps = Math.floor((size - 5) / 2);
    
        const firstX = buffer.readNegativeOffsetShortLE();
        const runSteps = buffer.readByte() === 1; // @TODO ?
        const firstY = buffer.readNegativeOffsetShortLE();
    
        console.log("walk to", runSteps, firstX, firstY);

    
        output.push(new Position(firstX, firstY));
    
        for(let i = 0; i < totalSteps; i++) {
            const x = buffer.readByte();
            const y = buffer.readPreNegativeOffsetByte();
            output.push(new Position(x + firstX, y + firstY));
        }

        return output;
    }

    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        const positions = WalkAction.ParseRequest(packetId, packetSize, buffer);
        
        player.movementHandler.reset();
        
        for (let position of positions) {
            player.movementHandler.addToPath(position);
        }

        player.movementHandler.finish();
    }
}