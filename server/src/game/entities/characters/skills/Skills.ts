import { Character } from "../Character";
import { Skill } from "./Skill";

import { Attack } from "./attack/Attack";
import { Defence } from "./defence/Defence";
import { Strength } from "./strength/Strength";
import { Hitpoints } from "./hitpoints/Hitpoints";
import { Ranged } from "./ranged/Ranged";
import { Prayer } from "./prayer/Prayer";
import { Magic } from "./magic/Magic";
import { Cooking } from "./cooking/Cooking";
import { Woodcutting } from "./woodcutting/Woodcutting";
import { Fletching } from "./fletching/Fletching";
import { Fishing } from "./fishing/Fishing";
import { Firemaking } from "./firemaking/Firemaking";
import { Crafting } from "./crafting/Crafting";
import { Smithing } from "./smithing/Smithing";
import { Mining } from "./mining/Mining";
import { Herblore } from "./herblore/Herblore";
import { Agility } from "./agility/Agility";
import { Thieving } from "./thieving/Thieving";
import { Slayer } from "./slayer/Slayer";
import { Farming } from "./farming/Farming";
import { Runecrafting } from "./runecrafting/Runecrafting";

export class SkillInfo {
    public static ATTACK = new SkillInfo(0, "Attack", -1);
    public static DEFENCE = new SkillInfo(1, "Defence", -1);
    public static STRENGTH = new SkillInfo(2, "Strength", -1);
    public static HITPOINTS = new SkillInfo(3, "Hitpoints", -1);
    public static RANGED = new SkillInfo(4, "Ranged", -1);
    public static PRAYER = new SkillInfo(5, "Prayer", -1);
    public static MAGIC = new SkillInfo(6, "Magic", -1);
    public static COOKING = new SkillInfo(7, "Cooking", -1);
    public static WOODCUTTING = new SkillInfo(8, "Woodcutting", 4272);
    public static FLETCHING = new SkillInfo(9, "Fletching", -1);
    public static FISHING = new SkillInfo(10, "Fishing", -1);
    public static FIREMAKING = new SkillInfo(11, "Firemaking", 4282);
    public static CRAFTING = new SkillInfo(12, "Crafting", -1);
    public static SMITHING = new SkillInfo(13, "Smithing", -1);
    public static MINING = new SkillInfo(14, "Mining", -1);
    public static HERBLORE = new SkillInfo(15, "Herblore", -1);
    public static AGILITY = new SkillInfo(16, "Agility", -1);
    public static THIEVING = new SkillInfo(17, "Thieving", -1);
    public static SLAYER = new SkillInfo(18, "Slayer", -1);
    public static FARMING = new SkillInfo(19, "Farming", -1);
    public static RUNECRAFTING = new SkillInfo(20, "Runecrafting", -1);

    private constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly advancementWidget: number,
    ) {}
}

export class Skills {

    private character: Character;

    public readonly attack: Attack;
    public readonly defence: Defence;
    public readonly strength: Strength;
    public readonly hitpoints: Hitpoints;
    public readonly ranged: Ranged;
    public readonly prayer: Prayer;
    public readonly magic: Magic;
    public readonly cooking: Cooking;
    public readonly woodcutting: Woodcutting;
    public readonly fletching: Fletching;
    public readonly fishing: Fishing;
    public readonly firemaking: Firemaking;
    public readonly crafting: Crafting;
    public readonly smithing: Smithing;
    public readonly mining: Mining;
    public readonly herblore: Herblore;
    public readonly agility: Agility;
    public readonly thieving: Thieving;
    public readonly slayer: Slayer;
    public readonly farming: Farming;
    public readonly runecrafting: Runecrafting;

    private skillIds: Skill[];

    public constructor(character: Character) {
        this.character = character;
        
        this.attack = new Attack(this.character);
        this.defence = new Defence(this.character);
        this.strength = new Strength(this.character);
        this.hitpoints = new Hitpoints(this.character);
        this.ranged = new Ranged(this.character);
        this.prayer = new Prayer(this.character);
        this.magic = new Magic(this.character);
        this.cooking = new Cooking(this.character);
        this.woodcutting = new Woodcutting(this.character);
        this.fletching = new Fletching(this.character);
        this.fishing = new Fishing(this.character);
        this.firemaking = new Firemaking(this.character);
        this.crafting = new Crafting(this.character);
        this.smithing = new Smithing(this.character);
        this.mining = new Mining(this.character);
        this.herblore = new Herblore(this.character);
        this.agility = new Agility(this.character);
        this.thieving = new Thieving(this.character);
        this.slayer = new Slayer(this.character);
        this.farming = new Farming(this.character);
        this.runecrafting = new Runecrafting(this.character);

        this.skillIds = [
            this.attack, this.defence, this.strength, this.hitpoints, this.ranged,
            this.prayer, this.magic, this.cooking, this.woodcutting, this.fletching,
            this.fishing, this.firemaking, this.crafting, this.smithing, this.mining,
            this.herblore, this.agility, this.thieving, this.slayer, this.farming,
            this.runecrafting
        ];
    }

    public syncSkills() {
        for (let skill of this.skillIds) {
            skill.sync();
        }
    }

    public getById(id: number): Skill {
        return this.skillIds[id];
    }
}