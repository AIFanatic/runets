import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { DataService } from "@runeserver-ts/service/DataService";
import { DoorAction } from "./DoorAction";

interface ObjectInteractionRequest {
    objectId: number;
    x: number;
    y: number;
}

enum ObjectInteractionOptions {
    OPTION_1 = 181,
    OPTION_2 = 241,
    OPTION_3 = 50,
    OPTION_4 = 136,
    OPTION_5 = 55,
}

export class ObjectInteraction {
    private static ParseRequest(packetId: number, packetSize: number, buffer: StreamBuffer): ObjectInteractionRequest {
        if (packetId == ObjectInteractionOptions.OPTION_1) {
            const x = buffer.readNegativeOffsetShortBE();
            const y = buffer.readUnsignedShortLE();
            const objectId = buffer.readUnsignedShortLE();
            return { objectId, x, y };
        }
        else if (packetId == ObjectInteractionOptions.OPTION_2) {
            const objectId = buffer.readUnsignedShortBE();
            const x = buffer.readUnsignedShortBE();
            const y = buffer.readNegativeOffsetShortBE();
            return { objectId, x, y };
        }
        else if (packetId == ObjectInteractionOptions.OPTION_3) {
            const y = buffer.readNegativeOffsetShortBE();
            const objectId = buffer.readUnsignedShortLE();
            const x = buffer.readNegativeOffsetShortLE();
            return { objectId, x, y };
        }
        else if (packetId == ObjectInteractionOptions.OPTION_4) {
            const x = buffer.readUnsignedShortBE();
            const y = buffer.readUnsignedShortLE();
            const objectId = buffer.readUnsignedShortBE();
            return { objectId, x, y };
        }
        else if (packetId == ObjectInteractionOptions.OPTION_5) {
            const objectId = buffer.readUnsignedShortLE();
            const y = buffer.readUnsignedShortLE();
            const x = buffer.readUnsignedShortBE();
            return { objectId, x, y };
        }
    }

    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        const request = ObjectInteraction.ParseRequest(packetId, packetSize, buffer);

        console.log("[ObjectInteraction]", request);
        
        DoorAction.ToggleDoor(player, request.objectId, request.x, request.y);
        player.skills.woodcutting.cutObject(request.objectId, request.x, request.y);
    }
}