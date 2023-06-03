import { Character } from "../../Character";
import { Skill } from "../Skill";
import { SkillInfo } from "../Skills";

export class Slayer extends Skill {
    constructor(character: Character) {
        super(character);

        this.info = SkillInfo.SLAYER;
    }
}