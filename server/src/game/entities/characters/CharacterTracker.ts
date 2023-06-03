import { GameService } from "@runeserver-ts/service/GameService";
import { Character } from "@runeserver-ts/game/entities/characters/Character";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { Npc } from "@runeserver-ts/game/entities/characters/npc/Npc";

export enum CharacterTrackingType {
    NPC,
    PLAYER
};

export class CharacterTracker {
    private player: Player;
    private tracked: Map<Character, boolean>;
    
    private unregisteredCount: number;
    private trackingType: CharacterTrackingType;

    constructor(player: Player, type: CharacterTrackingType) {
        this.player = player;
        this.trackingType = type;

        this.tracked = new Map();
        this.unregisteredCount = 0;
    }

    private parseCharacters(characters: Character[]) {
        for(const character of characters) {
            if (character instanceof Npc) {
                if(!GameService.getInstance().npcExists(character)) {
                    // Npc is no longer in the game world
                    continue;
                }
            }
            else if (character instanceof Player) {
                if(!GameService.getInstance().playerExists(character)) {
                    // Npc is no longer in the game world
                    continue;
                }

                if (character.equals(this.player)) {
                    // Other player is this player
                    continue;
                }
            }

            if (this.tracked.has(character)) {
                continue;
            }

            if(!character.position.isViewableFrom(this.player.position)) {
                // Player or npc is still too far away to be worth rendering
                // Also - values greater than 15 and less than -15 are too large, or too small, to be sent via 5 bits (max length of 32)
                continue;
            }

            // Only 255 players or npcs are able to be rendered at a time
            // To help performance, we limit it to 200 here
            if(this.tracked.size >= 255) {
                return;
            }

            this.tracked.set(character, false);
            this.unregisteredCount++;
        }
    }

    public update() {
        if (this.trackingType == CharacterTrackingType.NPC) {
            const npcs = GameService.getInstance().getNpcs();
            this.parseCharacters(npcs);
        }
        else if (this.trackingType == CharacterTrackingType.PLAYER) {
            const players = GameService.getInstance().getPlayers();
            this.parseCharacters(players);
        }
    }

    public getTracked(): Map<Character, boolean> {
        return this.tracked;
    }

    public register(character: Character) {
        if (!this.tracked.has(character)) {
            console.error("Tried to register non existing character.");
            return;
        }

        this.tracked.set(character, true);
        this.unregisteredCount--;
    }

    public getUnregisteredCount(): number {
        return this.unregisteredCount;
    }

    public getRegisteredCount(): number {
        return Math.abs(this.unregisteredCount - this.tracked.size);
    }

    public remove(character: Character): boolean {
        return this.tracked.delete(character);
    }
}