import { Position } from "@runeserver-ts/game/entities/Position";

export interface WorldItem {
    itemId: number;
    position: Position;
    amount: number;
}