import { ClientData } from "@runeserver-ts/data/client/ClientData";
import { ServerData } from "@runeserver-ts/data/server/ServerData";

import { NpcDefinition } from "@runeserver-ts/game/entities/definitions/NpcDefinition";
import { ItemDefinition } from "@runeserver-ts/game/entities/definitions/ItemDefinition";
import { LandscapeObjectDefinition } from "@runeserver-ts/game/entities/definitions/LandscapeObjectDefinition";
import { MapObject } from "@runeserver-ts/game/map/MapObject";
import { Position } from "@runeserver-ts/game/entities/Position";

export class CacheData {
    public readonly npcs: Map<number, NpcDefinition>;
    public readonly items: Map<number, ItemDefinition>;
    public readonly landscapeItems: Map<number, LandscapeObjectDefinition>;
    
    public readonly walkableTiles: boolean[][][];

    // public readonly mapObjects: MapObject[];

    public readonly mapObjects: Map<string, MapObject>;

    constructor() {
        this.npcs = new Map();
        this.items = new Map();

        // TODO: Import client data files to dist
        const clientData = new ClientData("/Users/mac/Downloads/temp/runelite/runescape-web-client-377/client_cache");
        const serverData = new ServerData();

        for (let serverNpcDefinition of serverData.npcs) {
            const clientNpcDefinition = clientData.npcDefinitions.get(serverNpcDefinition.id);
            if (clientNpcDefinition && serverNpcDefinition.name == clientNpcDefinition.name) {
                const gameNpcDefinition: NpcDefinition = Object.assign({}, clientNpcDefinition, serverNpcDefinition);
                this.npcs.set(gameNpcDefinition.id, gameNpcDefinition);
            }
        }

        for (let serverItemDefinition of serverData.items) {
            const clientItemDefinition = clientData.itemDefinitions.get(serverItemDefinition.id);
            if (clientItemDefinition && serverItemDefinition.name == clientItemDefinition.name) {
                const gameItemDefinition: ItemDefinition = Object.assign({}, clientItemDefinition, serverItemDefinition);
                this.items.set(gameItemDefinition.id, gameItemDefinition);
            }
        }

        this.landscapeItems = clientData.landscapeObjectDefinitions;

        console.log(`[CacheData] Processed ${this.items.size} merged items.`);
        console.log(`[CacheData] Processed ${this.npcs.size} merged npcs.`);
        console.log(`[CacheData] Processed ${this.landscapeItems.size} landscape items.`);


        this.walkableTiles = [];
        for (let tile of clientData.mapRegions.mapRegionTileList) {
            if (!this.walkableTiles[tile.level]) this.walkableTiles[tile.level] = [];
            if (!this.walkableTiles[tile.level][tile.x]) this.walkableTiles[tile.level][tile.x] = [];
            
            this.walkableTiles[tile.level][tile.x][tile.y] = tile.nonWalkable;
        }

        this.mapObjects = new Map();

        for (let mapObject of clientData.mapRegions.mapObjectList) {
            const key = `${mapObject.objectId},${mapObject.x},${mapObject.y}`;

            const newMapObject = new MapObject(
                mapObject.objectId,
                new Position(mapObject.x, mapObject.y, mapObject.level),
                mapObject.type,
                mapObject.rotation
            );

            this.mapObjects.set(key, newMapObject);
        }
    }
}