import { ItemDefinition } from "@runeserver-ts/game/entities/definitions/ItemDefinition";

export class Item {
    public readonly definition: ItemDefinition;
    public amount: number;

    constructor(definition: ItemDefinition) {
        this.definition = definition;
        this.amount = 0;
    }
}