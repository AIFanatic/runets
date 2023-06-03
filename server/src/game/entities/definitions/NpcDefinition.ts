export interface NpcBonuses {
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

export interface NpcDrop {
    itemId: number;
    min_amount: number;
    max_amount: number;
    weight: number;
    drop_rate: "COMMON" | "UNCOMMON" | "RARE" | "VERY_RARE";
};

export interface NpcDrops {
    default: NpcDrop[];
    main: NpcDrop[];
    charm: NpcDrop[];
};

export interface NpcSpawn {
    x: number;
    y: number;
    z: number;
    is_walks: boolean; // ?
    direction: number;
}

export interface NpcDefinition {
    id: number;
    name: string;
    examine: string;
    lifepoints: number;
    attack_level: number;
    strength_level: number;
    defence_level: number;
    range_level: number;
    magic_level: number;
    bonuses: NpcBonuses;
    poison_amount: number;
    poison_immune: boolean;
    respawn_delay: number;
    attack_speed: number;
    movement_radius: number;
    agg_radius: number;
    melee_animation: number;
    defence_animation: number;
    death_animation: number;
    spawn_animation: number;
    magic_animation: number;
    range_animation: number;
    start_gfx: number;
    projectile: number;
    end_gfx: number;
    weakness: number;
    slayer_task: number;
    slayer_exp: number;
    combat_style: number;
    poisonous: boolean;
    aggressive: boolean;
    start_height: number;
    prj_height: number;
    end_height: number;
    clue_level: number;
    spell_id: number;
    combat_audio: string // check
    protect_style: number;
    force_talk: string // check
    safespot: boolean;

    drops: NpcDrops;
    spawn: NpcSpawn[];

    description: string;
    boundary: number;
    sizeX: number;
    sizeY: number;
    animations: {
        stand: number;
        walk: number;
        turnAround: number;
        turnRight: number;
        turnLeft: number;
    };
    turnDegrees: number;
    actions: string[];
    headModels: number[];
    minimapVisible: boolean;
    invisible: boolean;
    combatLevel: number;
    headIcon: number;
    clickable: boolean;
}