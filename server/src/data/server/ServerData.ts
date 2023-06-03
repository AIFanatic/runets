import { ServerItemDefinition } from "@runeserver-ts/data/server/definitions/ServerItemDefinition";
import { ServerNpcDefinition } from "@runeserver-ts/data/server/definitions/ServerNpcDefinition";

import { ItemParser } from "@runeserver-ts/data/server/parsers/ItemParser";
import { NpcParser } from "@runeserver-ts/data/server/parsers/NpcParser";

// This ones need relative paths?
// @ts-ignore
import ItemsConfigLocation from "@runeserver-ts/data/server/files/item_configs.json";
// @ts-ignore
import NpcConfigLocation from "@runeserver-ts/data/server/files/npc_configs.json";
// @ts-ignore
import NpcDropsLocation from "@runeserver-ts/data/server/files/npc_drops.json";
// @ts-ignore
import NpcSpawnsLocation from "@runeserver-ts/data/server/files/npc_spawns.json";

export class ServerData {
    public readonly items: ServerItemDefinition[];
    public readonly npcs: ServerNpcDefinition[];

    constructor() {
        this.items = ItemParser.ParseItemDefinitions(ItemsConfigLocation);
        this.npcs = NpcParser.ParseNpcDefinitions(NpcConfigLocation, NpcDropsLocation, NpcSpawnsLocation);

        console.log(`[ServerData] Loaded ${this.items.length} items.`);
        console.log(`[ServerData] Loaded ${this.npcs.length} npcs.`);
    }
}