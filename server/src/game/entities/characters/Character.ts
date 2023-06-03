import { Tickable } from "@runeserver-ts/util/Tickable";
import { CharacterActions } from "@runeserver-ts/game/entities/characters/CharacterActions";
import { Entity } from "@runeserver-ts/game/entities/Entity";
import { Inventory, InventoryConstants } from "@runeserver-ts/game/entities/characters/Inventory";
import { Skills } from "@runeserver-ts/game/entities/characters/skills/Skills";
import { UpdateFlags, Animation, Graphic } from "@runeserver-ts/game/entities/characters/UpdateFlags";
import { CharacterMovement } from "./CharacterMovement";

export class Character extends Entity implements Tickable {
    public readonly updateFlags: UpdateFlags;

    private walkDirection = -1;
    private runDirection = -1;
    private faceDirection = -1;
    private resetMovementQueue: boolean = false;
    private needsPlacement: boolean = false;
    private slot = -1;

    public readonly equipment: Inventory;
    public readonly inventory: Inventory;
    public readonly skills: Skills;

    public readonly actions: CharacterActions;
    public readonly movementHandler: CharacterMovement;

    constructor() {
        super();

        this.updateFlags = new UpdateFlags();

        this.equipment = new Inventory(InventoryConstants.EQUIPMENT_CAPACITY);
        this.inventory = new Inventory(InventoryConstants.INVENTORY_CAPACITY);
        this.skills = new Skills(this);
        this.actions = new CharacterActions();
        this.movementHandler = new CharacterMovement(this);
    }

    /**
     * Resets the entity after updating.
     */
     public reset() {
        this.updateFlags.reset();
        this.setWalkDirection(-1);
        this.setRunDirection(-1);
        this.setFaceDirection(-1);
        this.setResetMovementQueue(false);
    }
    
    public update() {
        this.actions.update();
        this.movementHandler.update();
    }

    public lateUpdate() {
        this.actions.lateUpdate();
    }

    /**
     * Sets the player's primary movement direction.
     */
    public setWalkDirection(walkDirection: number) {
        this.walkDirection = walkDirection;
    }
    public getWalkDirection(): number {
        return this.walkDirection;
    }

    /**
     * Sets the player's secondary movement direction.
     */
    public setRunDirection(runDirection: number) {
        this.runDirection = runDirection;
    }
    public getRunDirection(): number {
        return this.runDirection;
    }

    /**
     * Sets the player's secondary movement direction.
     */
     public setFaceDirection(faceDirection: number) {
        this.faceDirection = faceDirection;
    }
    public getFaceDirection(): number {
        return this.faceDirection;
    }

    public playAnimation(animation: Animation): void {
        this.updateFlags.animation = animation;
    }

    public playGraphics(graphics: Graphic): void {
        this.updateFlags.graphics = graphics;
    }

    public isResetMovementQueue(): boolean {
        return this.resetMovementQueue;
    }

    public setResetMovementQueue(resetMovementQueue: boolean) {
        this.resetMovementQueue = resetMovementQueue;
    }

    public dealDamage(damage: number, type: number, secondary: boolean) {
        const currentHealth = Math.max(this.skills.hitpoints.getLevel() - damage, 0);
        const maxHealth = this.skills.hitpoints.getLevelForExp(this.skills.hitpoints.getExp());
        
        if (secondary) this.updateFlags.secondaryHit = {damage: damage, type: type, health: currentHealth, maxHealth: maxHealth};
        else this.updateFlags.primaryHit = {damage: damage, type: type, health: currentHealth, maxHealth: maxHealth};

        this.skills.hitpoints.setLevel(currentHealth);
    }

    /**
     * Gets the character slot.
     */
     public getSlot(): number {
        return this.slot;
    }

    public setSlot(slot: number) {
        this.slot = slot;
    }

}