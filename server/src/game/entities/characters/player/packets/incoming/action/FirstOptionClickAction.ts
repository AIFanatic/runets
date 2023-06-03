import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { DataService } from "@runeserver-ts/service/DataService";

interface FirstOptionClickRequest {
    widgetId: number;
    slot: number;
    itemId: number;
}

enum FirstOptionClickTypes {
    MENU = 203,
    MOUSE_CLICK = 3
};

export class FirstOptionClickAction {
    private static ParseRequest(packetId: number, packetSize: number, buffer: StreamBuffer): FirstOptionClickRequest {
        console.log("ParseRequest", packetId);

        if (packetId == FirstOptionClickTypes.MENU) {
            const widgetId = buffer.readUnsignedShortLE();
            const slot = buffer.readShortLE();
            const itemId = buffer.readShortLE();

            return { widgetId: widgetId, slot: slot, itemId: itemId };
        }
        else if (packetId == FirstOptionClickTypes.MOUSE_CLICK) {
            const itemId = buffer.readNegativeOffsetShortBE();
            const widgetId = buffer.readShortBE();
            const slot = buffer.readShortBE();

            return { widgetId: widgetId, slot: slot, itemId: itemId };
        }

    }

    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        const firstOptionClickRequest = FirstOptionClickAction.ParseRequest(packetId, packetSize, buffer);

        const itemDefinition = DataService.getInstance().items.get(firstOptionClickRequest.itemId);
        if (!itemDefinition) {
            console.log("Invalid item");
            return;
        }

        console.log("firstOptionClickRequest", firstOptionClickRequest);
        const itemSlot = firstOptionClickRequest.slot;
        const inventoryItemSlot = player.inventory.get(itemSlot);
        if (!inventoryItemSlot) {
            console.log("Item not in player inventory");
            return;
        }

        player.skills.prayer.buryItem(inventoryItemSlot, itemSlot);
    }
}