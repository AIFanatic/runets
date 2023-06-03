import { Character } from "../../Character";
import { Skill } from "../Skill";
import { SkillInfo } from "../Skills";

export class Herblore extends Skill {
    constructor(character: Character) {
        super(character);

        this.info = SkillInfo.HERBLORE;
    }
}