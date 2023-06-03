export interface LandscapeObjectDefinition {
    id: number;
    name: string;
    description: string;
    sizeX: number;
    sizeY: number;
    solid: boolean;
    walkable: boolean;
    hasOptions: boolean;
    options: string[];
    face: number;
    translateX: number;
    translateY: number;
    translateLevel: number;
}