export interface ClientItemDefinition {
    id: number;
    name: string;
    description: string;
    stackable: boolean;
    value: number;
    members: boolean;
    groundOptions: string[];
    inventoryOptions: string[];
    notedVersionOf: number;
    teamIndex: number;
}