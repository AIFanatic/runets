import { Character } from "../../Character";
import { Skill } from "../Skill";
import { SkillInfo } from "../Skills";

export class Hitpoints extends Skill {
    constructor(character: Character) {
        super(character);

        this.info = SkillInfo.HITPOINTS;

        // values[SkillId.HITPOINTS] = { exp: 1154, level: 10 };

        this.exp = 1154;
        this.level = 10;
    }
}