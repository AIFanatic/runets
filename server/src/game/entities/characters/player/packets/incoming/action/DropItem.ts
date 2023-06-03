import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { InventoryWidgetIds } from "@runeserver-ts/game/entities/characters/Inventory";
import { GameService } from "@runeserver-ts/service/GameService";
import { Position } from "@runeserver-ts/game/entities/Position";

interface DropItemRequest {
    slot: number;
    itemId: number;
    widgetId: number;
}

export class DropItem {
    private static ParseRequest(packetId: number, packetSize: number, buffer: StreamBuffer): DropItemRequest {
        const slot = buffer.readShortLE();
        const itemId = buffer.readNegativeOffsetShortLE();
        const widgetId = buffer.readNegativeOffsetShortLE();

        return {
            slot: slot,
            itemId: itemId,
            widgetId: widgetId
        }
    }

    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        const dropItemRequest = DropItem.ParseRequest(packetId, packetSize, buffer);

        if (dropItemRequest.widgetId != InventoryWidgetIds.INVENTORY) {
            console.log("Attempted to drop item from incorrect widget.");
            return;
        }

        if (dropItemRequest.slot < 0 || dropItemRequest.slot > 27) {
            console.log("Attempted to drop item from invalid slot");
            return;
        }

        const itemInSlot = player.inventory.get(dropItemRequest.slot);
        if (!itemInSlot) {
            console.log("Attempted to drop non existing item.");
            return;
        }

        if (itemInSlot.definition.id !== dropItemRequest.itemId) {
            console.log("Item id in player slot does not match requested item id.");
            return false;
        }

        player.inventory.remove(dropItemRequest.slot);
        player.updateInventory();

        GameService.getInstance().addWorldItem({
            itemId: itemInSlot.definition.id,
            position: new Position(player.position.getX(), player.position.getY()),
            amount: 1
        });
    }
}