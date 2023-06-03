import { ItemDefinition } from "@runeserver-ts/game/entities/definitions/ItemDefinition";

export enum BonusWidgetId {
    ATTACK_STAB = 1675,
    ATTACK_SLASH = 1676,
    ATTACK_CRUSH = 1677,
    ATTACK_MAGIC = 1678,
    ATTACK_RANGE = 1679,

    DEFENCE_STAB = 1680,
    DEFENCE_SLASH = 1681,
    DEFENCE_CRUSH = 1682,
    DEFENCE_MAGIC = 1683,
    DEFENCE_RANGE = 1684,

    MELEE_STRENGTH = 1686,
    RANGED_STRENGTH = -1,
    MAGIC_DAMAGE = -1,
    PRAYER = 1687
};

export interface Bonus {
    id: number;
    amount: number;
    text: string;
}

export class PlayerBonuses {
    public readonly bonuses: Bonus[];

    constructor() {
        this.bonuses = [
            {id: BonusWidgetId.ATTACK_STAB, amount: 0, text: "Stab"},
            {id: BonusWidgetId.ATTACK_SLASH, amount: 0, text: "Slash"},
            {id: BonusWidgetId.ATTACK_CRUSH, amount: 0, text: "Crush"},
            {id: BonusWidgetId.ATTACK_MAGIC, amount: 0, text: "Magic"},
            {id: BonusWidgetId.ATTACK_RANGE, amount: 0, text: "Range"},

            {id: BonusWidgetId.DEFENCE_STAB, amount: 0, text: "Stab"},
            {id: BonusWidgetId.DEFENCE_SLASH, amount: 0, text: "Slash"},
            {id: BonusWidgetId.DEFENCE_CRUSH, amount: 0, text: "Crush"},
            {id: BonusWidgetId.DEFENCE_MAGIC, amount: 0, text: "Magic"},
            {id: BonusWidgetId.DEFENCE_RANGE, amount: 0, text: "Range"},

            {id: BonusWidgetId.MELEE_STRENGTH, amount: 0, text: "Strength"},
            {id: BonusWidgetId.PRAYER, amount: 0, text: "Prayer"},
        ]
    }

    public setFromItem(itemDefinition: ItemDefinition) {
        this.bonuses[0].amount = itemDefinition.bonuses.attack_stab;
        this.bonuses[1].amount = itemDefinition.bonuses.attack_slash;
        this.bonuses[2].amount = itemDefinition.bonuses.attack_crush;
        this.bonuses[3].amount = itemDefinition.bonuses.attack_magic;
        this.bonuses[4].amount = itemDefinition.bonuses.attack_range;

        this.bonuses[5].amount = itemDefinition.bonuses.defence_stab;
        this.bonuses[6].amount = itemDefinition.bonuses.defence_slash;
        this.bonuses[7].amount = itemDefinition.bonuses.defence_crush;
        this.bonuses[8].amount = itemDefinition.bonuses.defence_magic;
        this.bonuses[9].amount = itemDefinition.bonuses.defence_range;
        
        this.bonuses[10].amount = itemDefinition.bonuses.melee_strength;
        this.bonuses[11].amount = itemDefinition.bonuses.prayer;
    }
}