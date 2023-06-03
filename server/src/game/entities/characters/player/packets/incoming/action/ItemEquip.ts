import { InventoryWidgetIds } from "@runeserver-ts/game/entities/characters/Inventory";
import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { ItemRequirements } from "@runeserver-ts/game/entities/definitions/ItemDefinition";
import { Item } from "@runeserver-ts/game/Item";
import { DataService } from "@runeserver-ts/service/DataService";

interface ItemEquipRequest {
    widgetId: number;
    itemId: number;
    slot: number;
}

export class ItemEquip {
    private static ValidateRequirements(player: Player, requirements: ItemRequirements[]): boolean {
        for (let requirement of requirements) {
            const playerSkill = player.skills.getById(requirement.skillId);
            if (playerSkill.getLevel() < requirement.level) return false;
        }

        return true;
    }

    private static ParseRequest(packetId: number, packetSize: number, buffer: StreamBuffer): ItemEquipRequest {
        const widgetId = buffer.readShortLE();
        const itemId = buffer.readShortLE();
        const slot = buffer.readNegativeOffsetShortBE();

        return {
            widgetId: widgetId,
            itemId: itemId,
            slot: slot
        }
    }

    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        const equipRequest = ItemEquip.ParseRequest(packetId, packetSize, buffer);

        if(equipRequest.widgetId !== InventoryWidgetIds.INVENTORY) {
            console.log(`${player.attributes.getUsername()} attempted to equip item from incorrect widget id ${equipRequest.widgetId}.`);
            return;
        }
    
        if(equipRequest.slot < 0 || equipRequest.slot > 27) {
            console.log(`${player.attributes.getUsername()} attempted to equip item ${equipRequest.itemId} in invalid slot ${equipRequest.slot}.`);
            return;
        }
    
        const itemInSlot = player.inventory.get(equipRequest.slot);
    
        if(!itemInSlot) {
            console.log(`${player.attributes.getUsername()} attempted to equip item ${equipRequest.itemId} in slot ${equipRequest.slot}, but they do not have that item.`);
            return;
        }
    
        if(itemInSlot.definition.id !== equipRequest.itemId) {
            console.log(`${player.attributes.getUsername()} attempted to equip item ${equipRequest.itemId} in slot ${equipRequest.slot}, but ${itemInSlot.definition.id} was found there instead.`);
            return;
        }

        const itemDefinition = DataService.getInstance().items.get(equipRequest.itemId);
        if (!itemDefinition) {
            console.log("Could not find item in DataService.");
            return;
        }

        if (!itemDefinition.equipment_slot) {
            console.log("Cannot equip this item");
            return;
        }

        const hasValidRequirements = ItemEquip.ValidateRequirements(player, itemDefinition.requirements);
        if (!hasValidRequirements) {
            console.log("Invalid requirements to wield item.");
            return;
        }

        const equipmentInSlot = player.equipment.get(itemDefinition.equipment_slot);

        // Player has an item in requested equip slot
        if (equipmentInSlot) {
            const emptyInventorySlot = player.inventory.getEmptySlot();

            if (emptyInventorySlot == -1) {
                console.log("No available inventory space.");
                return;
            }

            player.equipment.remove(itemDefinition.equipment_slot);
            player.inventory.set(equipmentInSlot, emptyInventorySlot);
        }

        const item = new Item(itemDefinition);
        item.amount = itemInSlot.amount;

        console.log(`Equiping ${itemDefinition.name} in slot ${itemDefinition.equipment_slot}`);

        player.inventory.remove(equipRequest.slot);
        player.equipment.set(item, itemDefinition.equipment_slot);
        player.attributes.getBonuses().setFromItem(itemDefinition);

        player.updateInventory();
        player.updateEquipment();
        player.updateBonuses();

        player.updateFlags.appearanceUpdateRequired = true;
    }
}