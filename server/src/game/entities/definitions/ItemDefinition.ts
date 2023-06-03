export interface ItemRequirements {
    skillId: number;
    level: number;
};

export interface ItemBonuses {
    attack_stab: number;
    attack_slash: number;
    attack_crush: number;
    attack_magic: number;
    attack_range: number;

    defence_stab: number;
    defence_slash: number;
    defence_crush: number;
    defence_magic: number;
    defence_range: number;

    melee_strength: number;
    ranged_strength: number;
    magic_damage: number;
    prayer: number;
}

export interface ItemDefinition {
    id: number;
    name: string;
    examine: string;
    tradeable: boolean;
    lendable: boolean;
    low_alchemy: number;
    high_alchemy: number;
    destroy: boolean;
    destroy_message: string;
    shop_price: number;
    grand_exchange_price: number;
    remove_head: boolean;
    remove_beard: boolean;
    remove_sleeves: boolean;
    stand_anim: number;
    stand_turn_anim: number;
    walk_anim: number;
    run_anim: number;
    turn180_anim: number;
    turn90cw_anim: number;
    turn90ccw_anim: number;
    render_anim: number;
    equipment_slot: number;
    attack_speed: number;
    absorb: string; // check
    bonuses: ItemBonuses; // check
    weapon_interface: number;
    has_special: boolean;
    two_handed: boolean;
    attack_anims: string; // check
    defence_anim: number;
    attack_audios: string; // check
    requirements: ItemRequirements[]; // check {0,30}-{4,30}-{6,30} {skillid,level}
    weight: number;
    ge_buy_limit: number;
    bankable: boolean;
    rare_item: boolean;
    tokkul_price: number;
    point_price: number;
    fun_weapon: boolean;
    archery_ticket_price: number;

    description: string;
    stackable: boolean;
    value: number;
    members: boolean;
    groundOptions: string[];
    inventoryOptions: string[];
    notedVersionOf: number;
    teamIndex: number;
}