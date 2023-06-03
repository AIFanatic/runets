import { Position } from "@runeserver-ts/game/entities/Position";

export abstract class Entity {
    private _position: Position = new Position(0, 0, 0);
    private _lastRegionPosition: Position = new Position(0, 0, 0);

    constructor() {
    }

    get position(): Position {
        return this._position;
    }

    set position(value: Position) {
        if(!this._position) {
            this._lastRegionPosition = value;
        }

        this._position = value;
    }

    get lastRegionPosition(): Position {
        return this._lastRegionPosition;
    }

    set lastRegionPosition(value: Position) {
        this._lastRegionPosition = value;
    }
}