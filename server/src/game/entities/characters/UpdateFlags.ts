import { Position } from "@runeserver-ts/game/character/Position";
import { Player } from "@runeserver-ts/game/character/player/Player";

/**
 * A specific chat message.
 */
export interface ChatMessage {
    color?: number;
    effects?: number;
    data?: Buffer;
    message?: string;
}

/**
 * A graphic.
 */
export interface Graphic {
    id: number;
    height: number;
    delay?: number;
}

/**
 * An animation.
 */
export interface Animation {
    id: number;
    delay?: number;
}

export interface Transform {
    id: number;
}

export enum DamageType {
    HEAL,
    DAMAGE
};

export interface PrimaryHit {
    damage: number;
    type: DamageType;
    health: number;
    maxHealth: number;
}

export interface SecondaryHit {
    damage: number;
    type: DamageType;
    health: number;
    maxHealth: number;
}

/**
 * Various player updating flags.
 */
export class UpdateFlags {

    private _mapRegionUpdateRequired: boolean;
    private _appearanceUpdateRequired: boolean;

    private _chatMessages: ChatMessage[];
    private _facePosition: Position;
    private _faceMob: Player;
    private _graphics: Graphic;
    private _animation: Animation;
    private _primaryHit: PrimaryHit;
    private _secondaryHit: SecondaryHit;
    private _transform: Transform;

    public constructor() {
        this._chatMessages = [];
        this.reset();
    }

    public reset(): void {
        this._mapRegionUpdateRequired = false;
        this._appearanceUpdateRequired = false;
        this._facePosition = null;
        this._faceMob = undefined;
        this._graphics = null;
        this._animation = undefined;
        this._primaryHit = undefined;
        this._secondaryHit = undefined;
        this._transform = undefined;

        if(this._chatMessages.length !== 0) {
            this._chatMessages.shift();
        }
    }

    public addChatMessage(chatMessage: ChatMessage): void {
        if(this._chatMessages.length > 4) {
            return;
        }

        this._chatMessages.push(chatMessage);
    }

    public get updateBlockRequired(): boolean {
        return this._appearanceUpdateRequired || this._chatMessages !== null || this._facePosition !== null ||
            this._graphics !== null || this._animation !== undefined || this._faceMob !== undefined;
    }

    public get mapRegionUpdateRequired(): boolean {
        return this._mapRegionUpdateRequired;
    }

    public set mapRegionUpdateRequired(value: boolean) {
        this._mapRegionUpdateRequired = value;
    }

    public get appearanceUpdateRequired(): boolean {
        return this._appearanceUpdateRequired;
    }

    public set appearanceUpdateRequired(value: boolean) {
        this._appearanceUpdateRequired = value;
    }

    public get chatMessages(): ChatMessage[] {
        return this._chatMessages;
    }

    public set chatMessages(value: ChatMessage[]) {
        this._chatMessages = value;
    }

    public get facePosition(): Position {
        return this._facePosition;
    }

    public set facePosition(value: Position) {
        this._facePosition = value;
    }

    public get faceMob(): Player {
        return this._faceMob;
    }

    public set faceMob(value: Player) {
        this._faceMob = value;
    }

    public get graphics(): Graphic {
        return this._graphics;
    }

    public set graphics(value: Graphic) {
        this._graphics = value;
    }

    public get animation(): Animation {
        return this._animation;
    }

    public set animation(value: Animation) {
        this._animation = value;
    }

    public get primaryHit(): PrimaryHit {
        return this._primaryHit;
    }

    public set primaryHit(value: PrimaryHit) {
        this._primaryHit = value;
    }

    public get secondaryHit(): SecondaryHit {
        return this._secondaryHit;
    }

    public set secondaryHit(value: SecondaryHit) {
        this._secondaryHit = value;
    }

    public get transform(): Transform {
        return this._transform;
    }

    public set transform(value: Transform) {
        this._transform = value;
    }
}