export interface ClientNpcDefinition {
    id: number;
    name: string;
    description: string;
    boundary: number;
    sizeX: number;
    sizeY: number;
    animations: {
        stand: number;
        walk: number;
        turnAround: number;
        turnRight: number;
        turnLeft: number;
    };
    turnDegrees: number;
    actions: string[];
    headModels: number[];
    minimapVisible: boolean;
    invisible: boolean;
    combatLevel: number;
    headIcon: number;
    clickable: boolean;
}