import { Packet, PacketType } from "@runeserver-ts/net/Packet";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { WorldItem } from "@runeserver-ts/game/entities/definitions/WorldItem";
import { Position } from "@runeserver-ts/game/entities/Position";
import { MapObject } from "@runeserver-ts/game/map/MapObject";

export class PlayerOutgoingPackets {
    
    private player: Player;
    
    constructor(player: Player) {
        this.player = player;
    }

    public updateEnergy(energy: number) {
        const packet = new Packet(125);
        packet.writeByte(energy);

        this.player.client.send(packet);
    }

    public updateReferencePosition(position: Position): void {
        const offsetX = position.getX() - (this.player.lastRegionPosition.regionX * 8);
        const offsetY = position.getY() - (this.player.lastRegionPosition.regionY * 8);

        const packet = new Packet(75);
        packet.writeByteInverted(offsetX);
        packet.writeOffsetByte(offsetY);

        this.player.client.send(packet);
    }
    
    private getChunkOffset(regionX: number, regionY: number): { offsetX: number, offsetY: number } {
        let offsetX = (regionX + 6) * 8;
        let offsetY = (regionY + 6) * 8;
        offsetX -= (this.player.lastRegionPosition.regionX * 8);
        offsetY -= (this.player.lastRegionPosition.regionY * 8);

        return { offsetX, offsetY };
    }

    public clearRegion(regionX: number, regionY: number): void {
        const { offsetX, offsetY } = this.getChunkOffset(regionX, regionY);

        const packet = new Packet(40);
        packet.writeNegativeOffsetByte(offsetY);
        packet.writeByteInverted(offsetX);

        this.player.client.send(packet);
    }

    public setWorldItem(worldItem: WorldItem, offset: number = 0): void {
        this.updateReferencePosition(worldItem.position);

        const packet = new Packet(107);
        packet.writeShortBE(worldItem.itemId);
        packet.writeByteInverted(offset);
        packet.writeNegativeOffsetShortBE(worldItem.amount);

        this.player.client.send(packet);
    }

    public removeWorldItem(worldItem: WorldItem, offset: number = 0): void {
        this.updateReferencePosition(worldItem.position);

        const packet = new Packet(208);
        packet.writeNegativeOffsetShortBE(worldItem.itemId);
        packet.writeOffsetByte(offset);

        this.player.client.send(packet);
    }

    public setMapObject(mapObject: MapObject, offset: number = 0): void {
        this.updateReferencePosition(mapObject.position);

        const packet = new Packet(152);
        packet.writeByteInverted((mapObject.type << 2) + (mapObject.rotation & 3));
        packet.writeOffsetShortLE(mapObject.id);
        packet.writeOffsetByte(offset);

        this.player.client.send(packet);
    }

    public removeMapObject(mapObject: MapObject, offset: number = 0): void {
        this.updateReferencePosition(mapObject.position);

        console.log("[removemapObject] Removing door");
        
        const packet = new Packet(88);
        packet.writeNegativeOffsetByte(offset);
        packet.writeNegativeOffsetByte((mapObject.type << 2) + (mapObject.rotation & 3));

        this.player.client.send(packet);
    }

    /**
     * Sends and refreshes the map region.
     */
    public updateMapRegion(regionX: number, regionY: number) {
        const packet = new Packet(222);
        packet.writeShortBE(regionY + 6); // Map Chunk Y
        packet.writeOffsetShortLE(regionX + 6); // Map Chunk X

        this.player.client.send(packet);
    }

    public updateAllWidgetItems(widgetId: number, itemsId: number[], itemsAmounts: number[]): void {
        const packet = new Packet(206, PacketType.DYNAMIC_LARGE);
        packet.writeShortBE(widgetId);
        packet.writeShortBE(itemsId.length);

        for (let i = 0; i < itemsId.length; i++) {
            const itemId = itemsId[i];
            const itemAmount = itemsAmounts[i];

            if(itemId === -1) {
                // Empty slot
                packet.writeOffsetShortLE(0);
                packet.writeUnsignedByteInverted(-1);
            } else {
                packet.writeOffsetShortLE(itemId + 1); // +1 because 0 means an empty slot

                if(itemAmount >= 255) {
                    packet.writeUnsignedByteInverted(254);
                    packet.writeIntLE(itemAmount);
                } else {
                    packet.writeUnsignedByteInverted(itemAmount - 1);
                }
            }
        }

        this.player.client.send(packet);
    }

    public updateWidgetSetting(settingId: number, value: number): void {
        let packet: Packet;

        if(value > 255) {
            // @TODO large settings values - packet 115?
        } else {
            packet = new Packet(182);
            packet.writeOffsetShortBE(settingId);
            packet.writeNegativeOffsetByte(value);
        }

        this.player.client.send(packet);
    }


    public updateSkill(skillId: number, level: number, exp: number): void {
        const packet = new Packet(49);
        packet.writeByteInverted(skillId);
        packet.writeUnsignedByte(level);
        packet.writeIntBE(exp);

        this.player.client.send(packet);
    }

    public updateTabWidget(tabIndex: number, widgetId: number): void {
        const packet = new Packet(10);
        packet.writeNegativeOffsetByte(tabIndex);
        packet.writeOffsetShortBE(widgetId);

        this.player.client.send(packet);
    }

    /**
     * Sends a message to the players chat box.
     *
     * @param message the message
     */
     public sendMessage(message: string) {
        const packet = new Packet(63, PacketType.DYNAMIC_SMALL);
        packet.writeString(message);

        this.player.client.send(packet);
    }

    public updateClientSetting(settingId: number, value: number): void {
        let packet: Packet;

        if(value > 255) {
            // @TODO large settings values - packet 115?
        } else {
            packet = new Packet(182);
            packet.writeOffsetShortBE(settingId);
            packet.writeNegativeOffsetByte(value);
        }

        this.player.client.send(packet);
    }

    public updateWidgetString(widgetId: number, value: string): void {
        const packet = new Packet(232, PacketType.DYNAMIC_LARGE);
        packet.writeOffsetShortLE(widgetId);
        packet.writeString(value);

        this.player.client.send(packet);
    }

    public playSong(songId: number): void {
        const packet = new Packet(220);
        packet.writeOffsetShortLE(songId);

        this.player.client.send(packet);
    }

    public playSound(soundId: number, volume: number, delay: number = 0): void {
        const packet = new Packet(26);
        packet.writeShortBE(soundId);
        packet.writeByte(volume);
        packet.writeShortBE(delay);

        this.player.client.send(packet);
    }    

    public sendLogout(): void {
        this.player.client.send(new Packet(5));
    }
}