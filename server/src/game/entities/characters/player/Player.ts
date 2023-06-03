import { Client } from "@runeserver-ts/game/client/Client";

import { Server } from "@runeserver-ts/Server";
import { PlayerAttributes } from "@runeserver-ts/game/entities/characters/player/attributes/PlayerAttributes";
import { Position } from "@runeserver-ts/game/entities/Position";
import { PlayerIncomingPackets } from "@runeserver-ts/game/entities/characters/player/packets/incoming/PlayerIncomingPackets";
import { PlayerOutgoingPackets } from "@runeserver-ts/game/entities/characters/player/packets/outgoing/PlayerOutgoingPackets";
import { Character } from "@runeserver-ts/game/entities/characters/Character";
import { WidgetSettings } from "@runeserver-ts/game/entities/characters/player/attributes/PlayerSettings";
import { Inventory, InventoryWidgetIds } from "@runeserver-ts/game/entities/characters/Inventory";

import { PlayerUpdateHandler } from "@runeserver-ts/game/entities/characters/player/PlayerUpdateHandler";
import { NpcUpdateHandler } from "@runeserver-ts/game/entities/characters/player/NpcUpdateHandler";
import { GameService } from "@runeserver-ts/service/GameService";

export enum PlayerPrivilege {
    REGULAR,
    MODERATOR,
    ADMINISTRATOR
}

export class Player extends Character {
    private static SIDEBAR_INTERFACE_IDS = [
        2423, 3917, 638, 3213, 1644, 5608, 1151, -1, 5065, 5715, 2449, 904, 147, 962
        // -1, 3917, 638, 3213, 1644, 5608, 1151, -1, 5065, 5715, 2449, 4445, 147, 6299
    ];
    public worldIndex: number = 1;

    public readonly client: Client;
    public readonly incomingPacketHandler: PlayerIncomingPackets;
    public readonly outgoingPacketHandler: PlayerOutgoingPackets;

    public readonly attributes: PlayerAttributes;
    private readonly playerUpdateHandler: PlayerUpdateHandler;
    private readonly npcUpdateHandler: NpcUpdateHandler;

    constructor(client: Client) {
        super();

        this.incomingPacketHandler = new PlayerIncomingPackets(this);
        this.outgoingPacketHandler = new PlayerOutgoingPackets(this);
        this.client = client;
        
        this.client.onDataReceivedCallback = (buffer) => {
            const dataParser = new PlayerIncomingPackets(this);
            dataParser.parse(buffer);
        }

        this.client.onDisconnected = () => {
            this.stopSession();
        }

        this.playerUpdateHandler = new PlayerUpdateHandler(this);
        this.npcUpdateHandler = new NpcUpdateHandler(this);

        this.attributes = new PlayerAttributes();
    }

    public initSession(newPlayer: boolean) {
        this.updateFlags.mapRegionUpdateRequired = true;
        this.updateFlags.appearanceUpdateRequired = true;

        const settings = Server.getInstance().getSettings();

        // TEMP: Setting the default position
        this.position.setAs(new Position(3222, 3222, 0));

        this.skills.syncSkills();

        // Test
        this.inventory.addById(1048); // White party hat
        this.inventory.addById(1351); // Bronze axe
        this.inventory.addById(1277); // Bronze sword

        this.inventory.addById(526); // Bone
        this.inventory.addById(526); // Bone
        this.inventory.addById(526); // Bone

        this.updateInventory();
        
        this.updateEquipment();
        
        this.updateTabs();

        this.outgoingPacketHandler.updateEnergy(this.attributes.getRunEnergy());
        this.updateWidgetSettings();

        this.outgoingPacketHandler.sendMessage("Welcome to " + settings.serverName + "!");
        console.log(this + " has logged in.");

        this.updateBonuses();

        setTimeout(() => {
            console.log("Playing song.")
            this.outgoingPacketHandler.playSong(76);
        }, 5000);


        // setTimeout(() => {
        //     console.log("adding a log");

        //     const worldItem: WorldItem = {
        //         itemId: 1511,
        //         position: new Position(3222, 3222),
        //         amount: 1
        //     };

        //     GameService.getInstance().addWorldItem(worldItem);

        //     // setTimeout(() => {
        //     //     console.log("removing world item")
        //     //     GameService.getInstance().addWorldItem(worldItem);

        //     //     setTimeout(() => {
        //     //         GameService.getInstance().removeWorldItem(worldItem);
        //     //     }, 5000);
        //     // }, 5000);

        // }, 10000);


        // setTimeout(() => {
        //     console.log("Adding door");
        //     const landscapeItem: LandscapeObject = {
        //         objectId: 1530,
        //         position: new Position(3222, 3222),
        //         level: 0,
        //         type: 0,
        //         rotation: 0
        //     }

        //     GameService.getInstance().addLandscapeItem(landscapeItem);

        //     setTimeout(() => {
        //         console.log("Removing door");
        //         GameService.getInstance().removeLandscapeItem(landscapeItem);
        //     }, 5000);
        // }, 10000);
    }

    public stopSession() {
        GameService.getInstance().removePlayer(this);

        this.outgoingPacketHandler.sendLogout();
        this.client.disconnect();
        console.log(`${this.attributes.getUsername()} has logged out.`);
    }

    public getRunEnergyIncrement(): number {
        return 0.6;
    }

    public getRunEnergyDecrement(): number {
        return 0.6;
    }

    public equals(player: Player): boolean {
        if (this.worldIndex !== player.worldIndex) return false;
        if (this.attributes.getUsername() !== player.attributes.getUsername()) return false;
        if (this.attributes.getUserId() !== player.attributes.getUserId()) return false;
        if (this.getSlot() !== player.getSlot()) return false;

        return true;
    }

    public update() {
        super.update()
        
        this.playerUpdateHandler.update();
        this.npcUpdateHandler.update();

        if(this.updateFlags.mapRegionUpdateRequired) {
            this.outgoingPacketHandler.updateMapRegion(this.position.regionX, this.position.regionY);
        }
    }

    public lateUpdate() {
        super.lateUpdate()
        this.playerUpdateHandler.lateUpdate();
        this.npcUpdateHandler.lateUpdate();
    }

    public reset() {
        super.reset();
    }

    public updateWidgetSettings(): void {
        const settings = this.attributes.getSettings();
        this.outgoingPacketHandler.updateWidgetSetting(WidgetSettings.brightness, settings.brightness);
        this.outgoingPacketHandler.updateWidgetSetting(WidgetSettings.mouseButtons, settings.mouseButtons);
        this.outgoingPacketHandler.updateWidgetSetting(WidgetSettings.splitPrivateChat, settings.splitPrivateChat ? 1 : 0);
        this.outgoingPacketHandler.updateWidgetSetting(WidgetSettings.chatEffects, settings.chatEffects ? 0 : 1);
        this.outgoingPacketHandler.updateWidgetSetting(WidgetSettings.acceptAid, settings.acceptAid ? 1 : 0);
        // this.outgoingPacketHandler.updateWidgetSetting(WidgetSettings.musicVolume, settings.musicVolume);
        // this.outgoingPacketHandler.updateWidgetSetting(WidgetSettings.soundEffectVolume, settings.soundEffectVolume);
        this.outgoingPacketHandler.updateWidgetSetting(WidgetSettings.runMode, 0);
        // this.outgoingPacketHandler.updateWidgetSetting(WidgetSettings.autoRetaliate, settings.autoRetaliate ? 0 : 1);
    }

    private updateInventoryForType(type: InventoryWidgetIds, inventory: Inventory) {
        let itemIds: number[] = [];
        let itemAmounts: number[] = [];

        const inventoryItems = inventory.getItems();
        for (let slot = 0; slot < inventoryItems.length; slot++) {
            const item = inventoryItems[slot];
            if (item === null) {
                itemIds.push(-1);
                itemAmounts.push(0);
            }
            else {
                itemIds.push(item.definition.id);
                itemAmounts.push(item.amount);
            }
        }

        this.outgoingPacketHandler.updateAllWidgetItems(type, itemIds, itemAmounts);
    }

    public updateInventory() {
        this.updateInventoryForType(InventoryWidgetIds.INVENTORY, this.inventory);
    }

    public updateEquipment() {
        this.updateInventoryForType(InventoryWidgetIds.EQUIPMENT, this.equipment);
    }

    public updateBonuses() {
        for (let bonus of this.attributes.getBonuses().bonuses) {
            const text = `${bonus.text}: ${bonus.amount > 0 ? `+${bonus.amount}` : bonus.amount}`;
            this.outgoingPacketHandler.updateWidgetString(bonus.id, text);
        }
    }

    public updateTabs() {
        for (let tabIndex = 0; tabIndex < Player.SIDEBAR_INTERFACE_IDS.length; tabIndex++) {
            const widgetId = Player.SIDEBAR_INTERFACE_IDS[tabIndex];
            if(widgetId !== -1) {
                this.outgoingPacketHandler.updateTabWidget(tabIndex, widgetId);
            }
        }
    }
}