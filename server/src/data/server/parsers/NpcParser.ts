import { Parser } from "./Parser";
import { ServerNpcDefinition, ServerNpcBonuses, ServerNpcDrop, ServerNpcSpawn } from "@runeserver-ts/data/server/definitions/ServerNpcDefinition";

export class NpcParser {
    private static ParseNumber(str: string) {
        if (!str) return null;

        return parseInt(str);
    }

    private static ParseFloat(str: string) {
        if (!str) return null;

        return parseFloat(str);
    }

    private static ParseBoolean(str: string) {
        if (!str) return null;

        return str == "1" ? true : false;
    }

    // TODO: Validate, probably there is a better way to do this
    private static ParseBonuses(bonuses: string): ServerNpcBonuses {
        if (!bonuses) return {
            attack_stab: 0, attack_slash: 0, attack_crush: 0, attack_magic: 0, attack_range: 0,
            defence_stab: 0, defence_slash: 0, defence_crush: 0, defence_magic: 0, defence_range: 0,
            melee_strength: 0, ranged_strength: 0, magic_damage: 0, prayer: 0
        };

        const bonusesArray = bonuses.split(",");

        return {
            attack_stab: parseInt(bonusesArray[0]),
            attack_slash: parseInt(bonusesArray[1]),
            attack_crush: parseInt(bonusesArray[2]),
            attack_magic: parseInt(bonusesArray[3]),
            attack_range: parseInt(bonusesArray[4]),
        
            defence_stab: parseInt(bonusesArray[5]),
            defence_slash: parseInt(bonusesArray[6]),
            defence_crush: parseInt(bonusesArray[7]),
            defence_magic: parseInt(bonusesArray[8]),
            defence_range: parseInt(bonusesArray[9]),
        
            melee_strength: parseInt(bonusesArray[10]),
            ranged_strength: parseInt(bonusesArray[11]),
            magic_damage: parseInt(bonusesArray[12]),
            prayer: parseInt(bonusesArray[13]),
        }
    }

    // TODO: Validate
    // {0,30}-{4,30}-{6,30} {skillid,level}
    private static ParseDrops(npcDropsEntry: any): ServerNpcDrop[] {
        if (!npcDropsEntry) return [];

        const dropsStrArray = npcDropsEntry.split("~");
        const spanwsParsed: ServerNpcDrop[] = [];

        for (let dropstr of dropsStrArray) {
            const spawnArray = dropstr.split(",");

            spanwsParsed.push({
                itemId: NpcParser.ParseNumber(spawnArray[0].replace("{", "")),
                min_amount: NpcParser.ParseNumber(spawnArray[1]),
                max_amount: NpcParser.ParseNumber(spawnArray[2]),
                weight: NpcParser.ParseFloat(spawnArray[3]),
                drop_rate: spawnArray[4].replace("}", ""),
            })
        }

        return spanwsParsed;
    }

    // TODO: Make type, format is {npc_id: number, loc_data: string}
    private static ParseSpawn(npcSpawns: any): ServerNpcSpawn[] {
        if (!npcSpawns) return [];
        if (npcSpawns.loc_data == "") return [];

        const spawnsStrArray = npcSpawns.loc_data.split("-");
        const spanwsParsed: ServerNpcSpawn[] = [];

        for (let spawnStr of spawnsStrArray) {
            const spawnArray = spawnStr.split(",");

            spanwsParsed.push({
                x: NpcParser.ParseNumber(spawnArray[0].replace("{", "")),
                y: NpcParser.ParseNumber(spawnArray[1]),
                z: NpcParser.ParseNumber(spawnArray[2]),
                is_walks: NpcParser.ParseBoolean(spawnArray[3]),
                direction: NpcParser.ParseNumber(spawnArray[4].replace("}", "")),
            })
        }

        return spanwsParsed;
    }

    private static ParseFromJson(npcDefinition, npcDrops, npcSpawns): ServerNpcDefinition {
        const npc: ServerNpcDefinition = {
            id: NpcParser.ParseNumber(npcDefinition.id),
            name: npcDefinition.name,
            examine: npcDefinition.examine,
            lifepoints: NpcParser.ParseNumber(npcDefinition.lifepoints),
            attack_level: NpcParser.ParseNumber(npcDefinition.attack_level),
            strength_level: NpcParser.ParseNumber(npcDefinition.strength_level),
            defence_level: NpcParser.ParseNumber(npcDefinition.defence_level),
            range_level: NpcParser.ParseNumber(npcDefinition.range_level),
            magic_level: NpcParser.ParseNumber(npcDefinition.magic_level),
            bonuses: NpcParser.ParseBonuses(npcDefinition.bonuses),
            poison_amount: NpcParser.ParseNumber(npcDefinition.poison_amount),
            poison_immune: NpcParser.ParseBoolean(npcDefinition.poison_immune),
            respawn_delay: NpcParser.ParseNumber(npcDefinition.respawn_delay),
            attack_speed: NpcParser.ParseNumber(npcDefinition.attack_speed),
            movement_radius: NpcParser.ParseNumber(npcDefinition.movement_radius),
            agg_radius: NpcParser.ParseNumber(npcDefinition.agg_radius),
            melee_animation: NpcParser.ParseNumber(npcDefinition.melee_animation),
            defence_animation: NpcParser.ParseNumber(npcDefinition.defence_animation),
            death_animation: NpcParser.ParseNumber(npcDefinition.death_animation),
            spawn_animation: NpcParser.ParseNumber(npcDefinition.spawn_animation),
            magic_animation: NpcParser.ParseNumber(npcDefinition.magic_animation),
            range_animation: NpcParser.ParseNumber(npcDefinition.range_animation),
            start_gfx: NpcParser.ParseNumber(npcDefinition.start_gfx),
            projectile: NpcParser.ParseNumber(npcDefinition.projectile),
            end_gfx: NpcParser.ParseNumber(npcDefinition.end_gfx),
            weakness: NpcParser.ParseNumber(npcDefinition.weakness),
            slayer_task: NpcParser.ParseNumber(npcDefinition.slayer_task),
            slayer_exp: NpcParser.ParseNumber(npcDefinition.slayer_exp),
            combat_style: NpcParser.ParseNumber(npcDefinition.combat_style),
            poisonous: NpcParser.ParseBoolean(npcDefinition.poisonous),
            aggressive: NpcParser.ParseBoolean(npcDefinition.aggressive),
            start_height: NpcParser.ParseNumber(npcDefinition.start_height),
            prj_height: NpcParser.ParseNumber(npcDefinition.prj_height),
            end_height: NpcParser.ParseNumber(npcDefinition.end_height),
            clue_level: NpcParser.ParseNumber(npcDefinition.clue_level),
            spell_id: NpcParser.ParseNumber(npcDefinition.spell_id),
            combat_audio: npcDefinition.combat_audio, // check
            protect_style: NpcParser.ParseNumber(npcDefinition.protect_style),
            force_talk: npcDefinition.force_talk, // check
            safespot: NpcParser.ParseBoolean(npcDefinition.safespot),
        
            drops: {
                default: npcDrops && npcDrops.default ? NpcParser.ParseDrops(npcDrops.default): [],
                main: npcDrops && npcDrops.main ? NpcParser.ParseDrops(npcDrops.main) : [],
                charm: npcDrops && npcDrops.charm ? NpcParser.ParseDrops(npcDrops.charm) : [],
            },
            spawn: NpcParser.ParseSpawn(npcSpawns)
        }

        return npc;
    }

    public static ParseNpcDefinitions(npcConfigLocation: string, npcDropsLocation: string, npcSpawnsLocation: string): ServerNpcDefinition[] {
        const npcConfigData = Parser.requestFile(npcConfigLocation);
        const npcDropsData = Parser.requestFile(npcDropsLocation);
        const npcSpawnsData = Parser.requestFile(npcSpawnsLocation);

        if (!npcConfigData || !npcDropsData || !npcSpawnsData) {
            throw Error("Unable to process npcs data.");
        }

        const npcDropsMap = Parser.createHashmap(npcDropsData, "npc_id");
        const npcSpawnsMap = Parser.createHashmap(npcSpawnsData, "npc_id");

        const npcs: ServerNpcDefinition[] = [];

        for (let npc of npcConfigData) {
            const drops = npcDropsMap.get(npc.id);
            const spawns = npcSpawnsMap.get(npc.id);

            if (!spawns) continue;
            if (!spawns.loc_data || spawns.loc_data == "") continue;

            const npcDefinition = NpcParser.ParseFromJson(npc, drops, spawns);
            // TODO: Remove duplicates not efficient, just clean the file
            const existingNpcDefinitions = npcs.filter(value => value.id == npcDefinition.id);
            if (existingNpcDefinitions.length == 0) {
                npcs.push(npcDefinition);
            }
        }

        return npcs;
    }
}