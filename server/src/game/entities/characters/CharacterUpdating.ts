import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Character } from "@runeserver-ts/game/entities/characters/Character";

export class CharacterUpdating {
    /**
     * Appends movement data of a player or NPC to the specified updating packet.
     */
    public static appendMovement(mob: Character, packet: StreamBuffer): void {
        const walkDirection = mob.getWalkDirection();
        const runDirection = mob.getRunDirection();

        if(walkDirection !== -1) {
            // Mob is walking/running
            packet.writeBits(1, 1); // Update required

            if(runDirection === -1) {
                // Mob is walking
                packet.writeBits(2, 1); // Mob walking
                packet.writeBits(3, walkDirection); // mob.walkDirection
            } else {
                // Mob is running
                packet.writeBits(2, 2); // Mob running
                packet.writeBits(3, walkDirection); // mob.walkDirection
                packet.writeBits(3, runDirection); // mob.runDirection
            }

            packet.writeBits(1, mob.updateFlags.updateBlockRequired ? 1 : 0); // Whether or not an update flag block follows
        } else {
            // Did not move
            if(mob.updateFlags.updateBlockRequired) {
                packet.writeBits(1, 1); // Update required
                packet.writeBits(2, 0); // Signify the player did not move
            } else {
                packet.writeBits(1, 0); // No update required
            }
        }
    }
}