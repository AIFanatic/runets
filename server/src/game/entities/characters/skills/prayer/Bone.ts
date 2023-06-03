import { Item } from "@runeserver-ts/game/Item";

export enum BoneIds  {
    REGULAR_BONES = 526,
    BURNT_BONES = 528,
    BAT_BONES = 530,
    BIG_BONES = 532,
    BABY_DRAGON_BONES = 534,
    DRAGON_BONES = 536,
    WOLF_BONES = 2859,
    SHAIKAHAN_BONES = 3123,
    JOGRE_BONES = 3125,
    BURNT_ZOGRE_BONES = 3127,
    MONKEY_BONES_SMALL_0 = 3179,
    MONKEY_BONES_MEDIUM = 3180,
    MONKEY_BONES_LARGE_0 = 3181,
    MONKEY_BONES_LARGE_1 = 3182,
    MONKEY_BONES_SMALL_1 = 3183,
    SHAKING_BONES = 3187,
    FAYRG_BONES = 4830,
    RAURG_BONES = 4832,
    OURG_BONES = 4834
};

export enum BoneXp  {
    REGULAR_BONES = 40,
    BURNT_BONES = 5,
    BAT_BONES = 4,
    BIG_BONES = 45,
    BABY_DRAGON_BONES = 30,
    DRAGON_BONES = 72,
    WOLF_BONES = 14,
    SHAIKAHAN_BONES = 25,
    JOGRE_BONES = 15,
    BURNT_ZOGRE_BONES = 25,
    MONKEY_BONES_SMALL_0 = 13,
    MONKEY_BONES_MEDIUM = 14,
    MONKEY_BONES_LARGE_0 = 14,
    MONKEY_BONES_LARGE_1 = 14,
    MONKEY_BONES_SMALL_1 = 14,
    SHAKING_BONES = 14,
    FAYRG_BONES = 84,
    RAURG_BONES = 96,
    OURG_BONES = 140
};

export interface Bone {
    id: BoneIds;
    xp: number;
}

export class Bones {
    private static readonly bones: Bone[] = [
        {id: BoneIds.REGULAR_BONES, xp: BoneXp.REGULAR_BONES},
        {id: BoneIds.BURNT_BONES, xp: BoneXp.BURNT_BONES},
        {id: BoneIds.BAT_BONES, xp: BoneXp.BAT_BONES},
        {id: BoneIds.BABY_DRAGON_BONES, xp: BoneXp.BABY_DRAGON_BONES},
        {id: BoneIds.DRAGON_BONES, xp: BoneXp.DRAGON_BONES},
        {id: BoneIds.WOLF_BONES, xp: BoneXp.WOLF_BONES},
        {id: BoneIds.SHAIKAHAN_BONES, xp: BoneXp.SHAIKAHAN_BONES},
        {id: BoneIds.JOGRE_BONES, xp: BoneXp.JOGRE_BONES},
        {id: BoneIds.BURNT_ZOGRE_BONES, xp: BoneXp.BURNT_ZOGRE_BONES},
        {id: BoneIds.MONKEY_BONES_SMALL_0, xp: BoneXp.MONKEY_BONES_SMALL_0},
        {id: BoneIds.MONKEY_BONES_MEDIUM, xp: BoneXp.MONKEY_BONES_MEDIUM},
        {id: BoneIds.MONKEY_BONES_LARGE_0, xp: BoneXp.MONKEY_BONES_LARGE_0},
        {id: BoneIds.MONKEY_BONES_LARGE_1, xp: BoneXp.MONKEY_BONES_LARGE_1},
        {id: BoneIds.SHAKING_BONES, xp: BoneXp.SHAKING_BONES},
        {id: BoneIds.FAYRG_BONES, xp: BoneXp.FAYRG_BONES},
        {id: BoneIds.RAURG_BONES, xp: BoneXp.RAURG_BONES},
        {id: BoneIds.OURG_BONES, xp: BoneXp.OURG_BONES},
    ];

    public static getByItem(item: Item): Bone {
        for (let bone of Bones.bones) {
            if (bone.id === item.definition.id) return bone;
        }
        return null;
    }
}