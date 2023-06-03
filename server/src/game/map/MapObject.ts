import { DataService } from "@runeserver-ts/service/DataService";
import { LandscapeObjectDefinition } from "@runeserver-ts/game/entities/definitions/LandscapeObjectDefinition";
import { Position } from "@runeserver-ts/game/entities/Position";

export class MapObject {
    public readonly id: number;
    public readonly position: Position;
    public readonly type: number;
    public readonly rotation: number;

    constructor(id: number, position: Position, type: number, rotation: number) {
        this.id = id;
        this.position = position;
        this.type = type;
        this.rotation = rotation;
    }

    public getDefinition(): LandscapeObjectDefinition {
        if (!DataService.getInstance().landscapeItems.has(this.id)) {
            throw Error("Unable to find object in Cache landscape items.");
        }

        return DataService.getInstance().landscapeItems.get(this.id);
    }
}