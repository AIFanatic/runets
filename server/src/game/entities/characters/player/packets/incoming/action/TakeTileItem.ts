import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { GameService } from "@runeserver-ts/service/GameService";
import { DataService } from "@runeserver-ts/service/DataService";
import { Item } from "@runeserver-ts/game/Item";
import { Position } from "@runeserver-ts/game/entities/Position";

interface TakeTileItemRequest {
    id: number;
    position: Position
}

export class TakeTileItem {
    private static ParseRequest(packetId: number, packetSize: number, buffer: StreamBuffer): TakeTileItemRequest {
        const id = buffer.readNegativeOffsetShortLE();
		const x = buffer.readNegativeOffsetShortLE();
        const y = buffer.readNegativeOffsetShortBE();

        const position = new Position(x, y);
        return {
            id: id,
            position: position
        }
    }

    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        const takeTileRequest = TakeTileItem.ParseRequest(packetId, packetSize, buffer);

        if (!player.inventory.getEmptySlot()) {
            player.outgoingPacketHandler.sendMessage("Your inventory is full.");
            return;
        }

        const itemRegion = GameService.getInstance().getRegionForPosition(takeTileRequest.position);
        if (!itemRegion) {
            console.log("Invalid item region.");
            return;
        }
        
        const worldItem = itemRegion.getItem(takeTileRequest.id, takeTileRequest.position.getX(), takeTileRequest.position.getY());
        if (!worldItem) {
            console.log("Invalid world item.");
            return;
        }

        player.movementHandler.waitForCharacterToReachPosition(worldItem.position).then(reached => {
            if (!reached) {
                console.log("Failed to reach position.");
                return;
            }

            const itemDefinition = DataService.getInstance().items.get(worldItem.itemId);
            if (itemDefinition) {
                const item = new Item(itemDefinition);
                item.amount = worldItem.amount;
                GameService.getInstance().removeWorldItem(worldItem);
                player.inventory.add(item);
                player.outgoingPacketHandler.sendMessage(`You picked up ${item.definition.name}.`);
                player.updateInventory();
            }
        })

    }
}