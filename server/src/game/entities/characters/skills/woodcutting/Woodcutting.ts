import { Character } from "@runeserver-ts/game/entities/characters/Character";
import { Skill } from "@runeserver-ts/game/entities/characters/skills/Skill";
import { SkillInfo } from "@runeserver-ts/game/entities/characters/skills/Skills";
import { DataService } from "@runeserver-ts/service/DataService";
import { Player } from "../../player/Player";
import { WoodcuttingTrees } from "./WoodcuttingTrees";
import { WoodcuttingWeapons } from "./WoodcuttingWeapons";

export class Woodcutting extends Skill {
    constructor(character: Character) {
        super(character);

        this.info = SkillInfo.WOODCUTTING;
    }

    public cutObject(objectId: number, x: number, y: number) {
        if (!(this.character instanceof Player)) return;

        const player = this.character as Player;

        const landscapeItem = DataService.getInstance().landscapeItems.get(objectId);

        const treeId = WoodcuttingTrees.NORMAL.tree_ids.filter(id => id === objectId);
        if (treeId.length == 0) {
            console.log("Tried to cut something else, but not a tree");
            return;
        }

        const woodcuttingAxeSlot = 3;
        const axeEquipment = player.equipment.get(woodcuttingAxeSlot);
        if (!axeEquipment) {
            player.outgoingPacketHandler.sendMessage("Need an axe to cut trees.");
            return;
        }

        if (axeEquipment.definition.id != WoodcuttingWeapons.BRONZE_AXE) {
            player.outgoingPacketHandler.sendMessage("Need an axe to cut trees, got a sword.");
            return;
        }

        // TODO: 
        //      - Ensure player is at target
        //      - Check axe level
        //      - Replace tree with tree stump
        //      - Random cutting time based on axe and tree
        console.log(`Trying to cut ${objectId} at ${x}, ${y}`);
        console.log(landscapeItem)

        setTimeout(() => {
            player.playAnimation({id: 879});
            
        }, 1000);
    }
}