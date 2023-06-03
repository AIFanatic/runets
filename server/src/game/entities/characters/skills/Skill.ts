import { Character } from "../Character";
import { Player } from "../player/Player";
import { SkillInfo } from "./Skills";

export class Skill {
    public info: SkillInfo;

    protected readonly character: Character;

    protected exp: number;
    protected level: number;

    constructor(character: Character) {
        this.character = character;

        this.exp = 0;
        this.level = 1;
    }

    public getLevelForExp(exp: number): number {
        let points = 0;
        let output = 0;

        for(let i = 1; i <= 99; i++) {
            points += Math.floor(i + 300 * Math.pow(2, i / 7));
            output = Math.floor(points / 4);
            if(output >= exp) {
                return i;
            }
        }

        return 99;
    }

    public addExp(exp: number): void {
        const currentExp = this.exp;
        let finalExp = currentExp + exp;
        if(finalExp > 200000000) {
            finalExp = 200000000;
        }
        
        const currentLevel = this.getLevelForExp(currentExp);
        const finalLevel = this.getLevelForExp(finalExp);
        
        if(currentLevel !== finalLevel) {
            this.setLevel(finalLevel);
            this.character.playGraphics({ id: 199, delay: 0, height: 125 });
            
            if(this.character instanceof Player) {
                this.character.outgoingPacketHandler.sendMessage(`Congratulations, you just advanced a ${this.info.name.toLowerCase()} level.`);
                
                // const achievementDetails = skillDetails[skillId];
                // if(achievementDetails.advancementWidgetId) {
                    // dialogueAction(this.mob, { type: 'LEVEL_UP', skillId, lines: [
                        //     `@dbl@Congratulations, you just advanced a ${achievementDetails.name.toLowerCase()} level.`,
                        //         `Your ${achievementDetails.name.toLowerCase()} level is now ${finalLevel}.` ] }).then(d => d.close());
                        // // @TODO sounds
                        // }
            }
        }

        this.setExp(finalExp);
        this.sync();
    }

    public setExp(exp: number): void {
        this.exp = exp;
    }

    public setLevel(level: number): void {
        this.level = level;
    }

    public getExp(): number {
        return this.exp;
    }

    public getLevel(): number {
        return this.level;
    }

    public sync() {
        if (this.character instanceof Player) {
            this.character.outgoingPacketHandler.updateSkill(this.info.id, this.level, this.exp);
        }
    }
}