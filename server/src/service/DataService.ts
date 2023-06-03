import { Service } from "@runeserver-ts/service/Service";

import { CacheData } from "@runeserver-ts/data/CacheData";

import { ItemDefinition } from "@runeserver-ts/game/entities/definitions/ItemDefinition";
import { NpcDefinition } from "@runeserver-ts/game/entities/definitions/NpcDefinition";
import { LandscapeObjectDefinition } from "@runeserver-ts/game/entities/definitions/LandscapeObjectDefinition";
import { MapObject } from "@runeserver-ts/game/map/MapObject";

export class DataService implements Service {
    private static instance: DataService;

    private readonly cacheData: CacheData;

    public get items(): Map<number, ItemDefinition> {
        return this.cacheData.items;
    }

    public get npcs(): Map<number, NpcDefinition> {
        return this.cacheData.npcs;
    }

    public get landscapeItems(): Map<number, LandscapeObjectDefinition> {
        return this.cacheData.landscapeItems;
    }

    public get mapObjects(): Map<string, MapObject> {
        return this.cacheData.mapObjects;
    }

    private constructor() {
        this.cacheData = new CacheData();
    }

    public init() {}
    public tick() {}
    public cleanup() {}

    public static getInstance(): DataService {
        if (!DataService.instance) {
            DataService.instance = new DataService();
        }
        return DataService.instance;
    }
}