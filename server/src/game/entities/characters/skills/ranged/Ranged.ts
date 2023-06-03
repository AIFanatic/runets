import { Character } from "../../Character";
import { Skill } from "../Skill";
import { SkillInfo } from "../Skills";

export class Ranged extends Skill {
    constructor(character: Character) {
        super(character);

        this.info = SkillInfo.RANGED;
    }
}