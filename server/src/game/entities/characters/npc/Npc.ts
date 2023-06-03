import { uuidv4 } from "@runeserver-ts/util/uuidv4";
import { Character } from "@runeserver-ts/game/entities/characters/Character";
import { Position } from "@runeserver-ts/game/entities/Position";
import { NpcDefinition } from "@runeserver-ts/game/entities/definitions/NpcDefinition";

export class Npc extends Character {
    public readonly uuid: string;
    public readonly definition: NpcDefinition;

    public readonly worldIndex = 1;

    private initialPosition: Position = new Position(0,0,0);

    constructor(definition: NpcDefinition) {
        super();

        this.uuid = uuidv4();
        this.definition = definition;

        const position = new Position(this.definition.spawn[0].x, this.definition.spawn[0].y);
        this.position.setAs(position);
        this.initialPosition.setAs(position);

        // TODO: Set other skills stats and bonuses
        this.skills.hitpoints.setLevel(this.definition.lifepoints);

        // if (this.definition.name == "Hans") {
        //     setInterval(() => {
        //         console.log("[B] Hitting poor hans", this.definition.lifepoints, this.skills.hitpoints.getLevel());

        //         this.dealDamage(5, 1, false);
        //         console.log("[A] Hitting poor hans", this.skills.hitpoints.getLevel());

        //     }, 5000);
        // }
        // this.initiateRandomMovement()
        if (definition.drops.default.length > 0) {
            setInterval(() => {
                if (!this.movementHandler.isWalking()) {
                    const movementChance = Math.random();
    
                    if (movementChance < 0.7) return;
    
                    const movementXChance = Math.random() < 0.5;
                    const movementYChance = Math.random() < 0.5;
    
                    const movement_radius = 10;
    
                    const r = movement_radius * Math.sqrt(Math.random());
                    const theta = Math.random() * 2 * Math.PI;
    
                    const newX = this.initialPosition.getX() + r * Math.cos(theta);
                    const newY = this.initialPosition.getY() + r * Math.sin(theta);
    
                    const newPosition = new Position(
                        movementXChance ? newX : this.position.getX(),
                        movementYChance ? newY : this.position.getY(),
                    )
    
                    // console.log(`moving ${this.definition.name} ${this.getSlot()} from ${this.position.getX()}, ${this.position.getY()} to ${newPosition.getX()}, ${newPosition.getY()} ${this.movementHandler.s()}`);
    
                    this.movementHandler.reset();
                    this.movementHandler.addToPath(newPosition);
                    this.movementHandler.finish();
                }
    
            }, 1000);
        }
    }

    public initiateRandomMovement(): void {
        setInterval(() => {
            const movementChance = Math.floor(Math.random() * 10);
            const movementRadius = 20;

            if(movementChance < 7) {
                return;
            }

            let px: number;
            let py: number;
            let movementAllowed = false;


            while(!movementAllowed) {
                px = this.position.getX();
                py = this.position.getY();

                const moveXChance = Math.floor(Math.random() * 10);

                if(moveXChance > 6) {
                    const moveXAmount = Math.floor(Math.random() * 5);
                    const moveXMod = Math.floor(Math.random() * 2);

                    if(moveXMod === 0) {
                        px -= moveXAmount;
                    } else {
                        px += moveXAmount;
                    }
                }

                const moveYChance = Math.floor(Math.random() * 10);

                if(moveYChance > 6) {
                    const moveYAmount = Math.floor(Math.random() * 5);
                    const moveYMod = Math.floor(Math.random() * 2);

                    if(moveYMod === 0) {
                        py -= moveYAmount;
                    } else {
                        py += moveYAmount;
                    }
                }

                let valid = true;

                if(this instanceof Npc) {
                    if(px > this.initialPosition.getX() + movementRadius || px < this.initialPosition.getX() - movementRadius
                        || py > this.initialPosition.getY() + movementRadius || py < this.initialPosition.getY() - movementRadius) {
                        valid = false;
                    }
                }

                movementAllowed = valid;
            }

            if(px !== this.position.getX() || py !== this.position.getY()) {
                this.movementHandler.reset()
                // this.walkingQueue.valid = true;
                this.movementHandler.addToPath(new Position(px, py));
                this.movementHandler.finish();
            }
        }, 1000);
    }

    public set position(position: Position) {
        super.position = position;
    }

    public get position(): Position {
        return super.position;
    }

    public update() {
        super.update();
    }

    public lateUpdate() {
        super.lateUpdate();
    }

    public equals(other: Npc): boolean {
        if(!other) {
            return false;
        }

        return other.definition.id === this.definition.id && other.uuid === this.uuid;
    }
}