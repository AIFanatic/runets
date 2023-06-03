import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { GameService } from "@runeserver-ts/service/GameService";
import { Npc } from "@runeserver-ts/game/entities/characters/npc/Npc";

export class NpcInteraction {
    private static ParseRequest(packetId: number, packetSize: number, buffer: StreamBuffer): Npc {
        const methods = {
            67: 'readNegativeOffsetShortBE',
            112: 'readUnsignedShortLE',
            13: 'readNegativeOffsetShortLE',
            42: 'readUnsignedShortLE',
            8: 'readUnsignedShortLE'
        };
        const npcIndex = buffer[methods[packetId]]();
    
        // if(npcIndex < 0 || npcIndex > World.MAX_NPCS - 1) {
        //     return;
        // }
    
        const npc = GameService.getInstance().getNpcs()[npcIndex];
        if(!npc) {
            return;
        }

        return npc;
    }

    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        const npc = NpcInteraction.ParseRequest(packetId, packetSize, buffer);
        console.log("Interacted with", npc);
    }
}