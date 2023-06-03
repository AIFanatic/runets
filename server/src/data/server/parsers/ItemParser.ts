import { Parser } from "./Parser";
import { ServerItemDefinition, ServerItemBonuses, ServerItemRequirements } from "@runeserver-ts/data/server/definitions/ServerItemDefinition";

export class ItemParser {
    private static ParseNumber(str: string) {
        if (!str) return null;

        return parseInt(str);
    }

    private static ParseBoolean(str: string) {
        if (!str) return null;

        return str == "1" ? true : false;
    }

    // TODO: Validate, probably there is a better way to do this
    private static ParseBonuses(bonuses: string): ServerItemBonuses {
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
    private static ParseRequirements(requirements: string): ServerItemRequirements[] {
        if (!requirements) return [];

        const requirementsStrArray = requirements.split("-");
        const requirementsParsed: ServerItemRequirements[] = [];

        for (let requirementStr of requirementsStrArray) {
            const requirementArray = requirementStr.split(",");

            requirementsParsed.push({
                skillId: parseInt(requirementArray[0].replace("{", "")),
                level: parseInt(requirementArray[1].replace("}", ""))
            })
        }

        return requirementsParsed;
    }

    public static ParseFromJson(json): ServerItemDefinition {
        const item: ServerItemDefinition = {
            id: ItemParser.ParseNumber(json.id),
            name: json.name,
            examine: json.examine,
            tradeable: ItemParser.ParseBoolean(json.tradeable),
            lendable: ItemParser.ParseBoolean(json.lendable),
            low_alchemy: ItemParser.ParseNumber(json.low_alchemy),
            high_alchemy: ItemParser.ParseNumber(json.high_alchemy),
            destroy: ItemParser.ParseBoolean(json.destroy),
            destroy_message: json.destroy_message,
            shop_price: ItemParser.ParseNumber(json.shop_price),
            grand_exchange_price: ItemParser.ParseNumber(json.grand_exchange_price),
            remove_head: ItemParser.ParseBoolean(json.remove_head),
            remove_beard: ItemParser.ParseBoolean(json.remove_beard),
            remove_sleeves: ItemParser.ParseBoolean(json.remove_sleeves),
            stand_anim: ItemParser.ParseNumber(json.stand_anim),
            stand_turn_anim: ItemParser.ParseNumber(json.stand_turn_anim),
            walk_anim: ItemParser.ParseNumber(json.walk_anim),
            run_anim: ItemParser.ParseNumber(json.run_anim),
            turn180_anim: ItemParser.ParseNumber(json.turn180_anim),
            turn90cw_anim: ItemParser.ParseNumber(json.turn90cw_anim),
            turn90ccw_anim: ItemParser.ParseNumber(json.turn90ccw_anim),
            render_anim: ItemParser.ParseNumber(json.render_anim),
            equipment_slot: ItemParser.ParseNumber(json.equipment_slot),
            attack_speed: ItemParser.ParseNumber(json.attack_speed),
            absorb: json.absorb, // check
            bonuses: ItemParser.ParseBonuses(json.bonuses),
            weapon_interface: ItemParser.ParseNumber(json.weapon_interface),
            has_special: ItemParser.ParseBoolean(json.has_special),
            two_handed: ItemParser.ParseBoolean(json.two_handed),
            attack_anims: json.attack_anims, // check
            defence_anim: ItemParser.ParseNumber(json.defence_anim),
            attack_audios: json.attack_audios, // check
            requirements: ItemParser.ParseRequirements(json.requirements), // check {0,30}-{4,30}-{6,30} {skillid,level}
            weight: ItemParser.ParseNumber(json.weight),
            ge_buy_limit: ItemParser.ParseNumber(json.ge_buy_limit),
            bankable: ItemParser.ParseBoolean(json.bankable),
            rare_item: ItemParser.ParseBoolean(json.rare_item),
            tokkul_price: ItemParser.ParseNumber(json.tokkul_price),
            point_price: ItemParser.ParseNumber(json.point_price),
            fun_weapon: ItemParser.ParseBoolean(json.fun_weapon),
            archery_ticket_price: ItemParser.ParseNumber(json.archery_ticket_price),
        }

        return item;
    }

    public static ParseItemDefinitions(location: string): ServerItemDefinition[] {
        const data = Parser.requestFile(location);

        if (!data) {
            throw Error("Unable to process items data.");
        }

        const items: ServerItemDefinition[] = [];
        for (let entry of data) {
            items.push(ItemParser.ParseFromJson(entry));
        }

        return items;
    }
}