import { Tickable } from "@runeserver-ts/util/Tickable";
import { Deque } from "@runeserver-ts/util/Deque";
import { Position } from "@runeserver-ts/game/entities/Position";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { Character } from "@runeserver-ts/game/entities/characters/Character";
import { DataService } from "@runeserver-ts/service/DataService";
import { Npc } from "@runeserver-ts/game/entities/characters/npc/Npc";

/**
 * An internal Position type class with support for direction.
 *
 * @author blakeman8192
 */
class Point extends Position {

    private direction: number;

    /**
     * Creates a new Point.
     *
     * @param x         the X coordinate
     * @param y         the Y coordinate
     * @param direction the direction to this point
     */
    constructor(x: number, y: number, direction: number) {
        super(x, y);
        this.setDirection(direction);
    }

    /**
     * Gets the direction.
     *
     * @return the direction
     */
    public getDirection(): number {
        return this.direction;
    }

    /**
     * Sets the direction.
     *
     * @param direction the direction
     */
    public setDirection(direction: number) {
        this.direction = direction;
    }

}

export class CharacterMovement implements Tickable {

    private character: Character;
    private waypoints: Deque<Point> = new Deque();
    private runPath: boolean = false;

    /**
     * Creates a new PlayerMovement.
     */
    constructor(character: Character) {
        this.character = character;
    }

    public update() {
        let walkPoint: Point;
        let runPoint: Point = null;

        // Handle the movement.
        walkPoint = this.waypoints.poll();

        // Handling run toggling
        if (this.character instanceof Player) {
            const player: Player = this.character as Player;

            if (player.attributes.getSettings().runToggled || this.isRunPath()) {
                if (player.attributes.hasRunEnergy()) {
                    runPoint = this.waypoints.poll();
                } else { // Player is out of energy
                    player.outgoingPacketHandler.updateClientSetting(173, 0);
                    player.attributes.getSettings().runToggled = false;
                    this.setRunPath(false);
                    runPoint = null;
                }
            }
        } else if (this.isRunPath()) {
            runPoint = this.waypoints.poll();
        }

        // Walking
        if (walkPoint != null && walkPoint.getDirection() != -1) {
            if (!(this.character instanceof Player)) {
                // if (this.character.definition) {
                //     if (this.character.definition.id == 1) {
                        const nonWalkable = DataService.getInstance().cacheData.walkableTiles[walkPoint.getZ()][walkPoint.getX()][walkPoint.getY()];
    
                        let canWalk = true;
                        if (nonWalkable === undefined) canWalk = false;
                        if (nonWalkable === true) canWalk = false;
    
                        // console.log(`Man position ${walkPoint.getX()}, ${walkPoint.getY()} ${nonWalkable}, ${canWalk}`);
    
                        if (!canWalk) return;
                //     }
                // }
            }
            this.character.position.move(Position.DIRECTION_DELTA_X[walkPoint.getDirection()], Position.DIRECTION_DELTA_Y[walkPoint.getDirection()]);
            this.character.setWalkDirection(walkPoint.getDirection());
        }

        // Running
        if (runPoint != null && runPoint.getDirection() != -1) {
            this.character.position.move(Position.DIRECTION_DELTA_X[runPoint.getDirection()], Position.DIRECTION_DELTA_Y[runPoint.getDirection()]);
            this.character.setRunDirection(runPoint.getDirection());

            // Reducing energy
            if (this.character instanceof Player) {
                const player = this.character as Player;
                player.attributes.decreaseRunEnergy(player.getRunEnergyDecrement());
                player.outgoingPacketHandler.updateEnergy(player.attributes.getRunEnergy());
            }
        } else {
            // Restoring run energy
            if (this.character instanceof Player) {
                const player = this.character as Player;

                if (player.attributes.getRunEnergy() != 100) {
                    player.attributes.increaseRunEnergy(player.getRunEnergyIncrement());
                    player.outgoingPacketHandler.updateEnergy(player.attributes.getRunEnergy());
                }
            }
        }

        // Check for region changes.
        const deltaX = this.character.position.getX() - this.character.lastRegionPosition.regionX * 8;
        const deltaY = this.character.position.getY() - this.character.lastRegionPosition.regionY * 8;

        if (deltaX < 16 || deltaX >= 88 || deltaY < 16 || deltaY > 88) {
            if (this.character instanceof Player) {
                const player = this.character as Player;
                player.updateFlags.mapRegionUpdateRequired = true;
                player.lastRegionPosition.setAs(player.position);
            }
        }
    }

    public lateUpdate() {}

    /**
     * Resets the walking queue.
     */
    public reset() {
        this.setRunPath(false);
        this.waypoints.clear();

        // Set the base point as this position.
        const p = this.character.position;
        this.waypoints.add(new Point(p.getX(), p.getY(), -1));
    }

    /**
     * Finishes the current path.
     */
    public finish() {
        this.waypoints.poll();
    }

    /**
     * Adds a position to the path.
     *
     * @param position the position
     */
    public addToPath(position: Position) {
        if (this.waypoints.size == 0) {
            this.reset();
        }
        const last = this.waypoints.peekBack();
        let deltaX = position.getX() - last.getX();
        let deltaY = position.getY() - last.getY();

        const max = Math.max(Math.abs(deltaX), Math.abs(deltaY));

        for (let i = 0; i < max; i++) {
            if (deltaX < 0) {
                deltaX++;
            } else if (deltaX > 0) {
                deltaX--;
            }

            if (deltaY < 0) {
                deltaY++;
            } else if (deltaY > 0) {
                deltaY--;
            }
            this.addStep(position.getX() - deltaX, position.getY() - deltaY);
        }
    }

    /**
     * Adds a step.
     *
     * @param x the X coordinate
     * @param y the Y coordinate
     */
    private addStep(x: number, y: number) {
        if (this.waypoints.size >= 100) {
            return;
        }
        const last = this.waypoints.peekBack();
        const deltaX = x - last.getX();
        const deltaY = y - last.getY();
        const direction = Position.direction(deltaX, deltaY);

        if (direction > -1) {
            this.waypoints.add(new Point(x, y, direction));
        }
    }

    public waitForCharacterToReachPosition(position: Position, minDistance: number = 1): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const interval = setInterval(() => {
                if (this.character.position.distanceBetween(position) <= minDistance) {
                    clearInterval(interval);
                    resolve(true);
                }

                if (this.pendingMovementsSize() == 0) {
                    clearInterval(interval);
                    resolve(false)
                }
            }, 100);
        })
    }

    /**
     * Gets whether or not we're running for the current path.
     */
    public isRunPath(): boolean {
        return this.runPath;
    }

    /**
     * Toggles running for the current path only.
     */
    public setRunPath(runPath: boolean) {
        this.runPath = runPath;
    }

    public isWalking(): boolean {
        return this.waypoints.size != 0;
    }

    public pendingMovementsSize(): number {
        return this.waypoints.size;
    }
}