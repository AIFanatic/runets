import { Character } from "@runeserver-ts/game/entities/characters/Character";
import { SkillInfo } from "@runeserver-ts/game/entities/characters/skills/Skills";
import { Skill } from "@runeserver-ts/game/entities/characters/skills/Skill";

import { Bones } from "@runeserver-ts/game/entities/characters/skills/prayer/Bone";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { Item } from "@runeserver-ts/game/Item";

export class Prayer extends Skill {
    constructor(character: Character) {
        super(character);

        this.info = SkillInfo.PRAYER;
    }

    public buryItem(item: Item, inventorySlot: number) {
        const bone = Bones.getByItem(item);
        if (!bone) {
            console.log("Tried to bury an item that is not a bone.");
            return;
        }
        
        if (!(this.character instanceof Player)) {
            console.log("Only a player can bury bones.");
        } 

        const player = this.character as Player;

        player.actions.add({
            run: () => new Promise(resolve => {
                player.outgoingPacketHandler.sendMessage("You dig a hole in the gound...");
                player.inventory.remove(inventorySlot);
                player.playAnimation({id: 827, delay: 0});
                player.updateInventory();

                setTimeout(() => {
                    player.outgoingPacketHandler.sendMessage("You bury the bones.");
                    player.skills.prayer.addExp(bone.xp);

                    resolve(true);
                }, 1000);
            })
        })
    }
}