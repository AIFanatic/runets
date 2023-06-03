import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { GameService } from "@runeserver-ts/service/GameService";
import { Position } from "@runeserver-ts/game/entities/Position";
import { MapObject } from "@runeserver-ts/game/map/MapObject";

enum Orientation {
    WEST = 0,
    NORTH = 1,
    EAST = 2,
    SOUTH = 3,
};

enum HingeType {
    LEFT,
    RIGHT
};

enum DoorState {
    OPENED,
    CLOSED
}

interface DoorDefinition {
    // id: keyof DoorDefinitions;
    hinge: HingeType;
    state: DoorState;
    actionId: keyof DoorDefinitions;
};

interface DoorDefinitions {
    [key: number]: DoorDefinition
};

class Doors {
    public static PositionTranslation: Record<DoorState, Record<Orientation, {x: number, y: number}>> = {
        [DoorState.CLOSED]: {
            [Orientation.WEST]: {x: -1, y: 0},
            [Orientation.EAST]: {x: 1, y: 0},
            [Orientation.NORTH]: {x: 0, y: 1},
            [Orientation.SOUTH]: {x: 0, y: -1},
        },
        [DoorState.OPENED]: {
            [Orientation.WEST]: {x: 1, y: 0},
            [Orientation.EAST]: {x: -1, y: 0},
            [Orientation.NORTH]: {x: 0, y: -1},
            [Orientation.SOUTH]: {x: 0, y: 1},
        }
    }
    
    public static RotationTranslation: Record<DoorState, Record<HingeType, Record<Orientation, Orientation>>> = {
        [DoorState.CLOSED]: {
            [HingeType.LEFT]: {
                [Orientation.NORTH]: Orientation.WEST,
                [Orientation.SOUTH]: Orientation.EAST,
                [Orientation.WEST]: Orientation.SOUTH,
                [Orientation.EAST]: Orientation.NORTH,
            },
            [HingeType.RIGHT]: {
                [Orientation.NORTH]: Orientation.EAST,
                [Orientation.SOUTH]: Orientation.WEST,
                [Orientation.WEST]: Orientation.NORTH,
                [Orientation.EAST]: Orientation.SOUTH,
            }
        },
        [DoorState.OPENED]: {
            [HingeType.LEFT]: {
                [Orientation.NORTH]: Orientation.EAST,
                [Orientation.SOUTH]: Orientation.WEST,
                [Orientation.WEST]: Orientation.NORTH,
                [Orientation.EAST]: Orientation.SOUTH,
            },
            [HingeType.RIGHT]: {
                [Orientation.NORTH]: Orientation.WEST,
                [Orientation.SOUTH]: Orientation.EAST,
                [Orientation.WEST]: Orientation.SOUTH,
                [Orientation.EAST]: Orientation.NORTH,
            }
        }
    }

    public static Definitions: DoorDefinitions = {

        1516: { hinge: HingeType.LEFT, state: DoorState.CLOSED, actionId: 1517 },
        1517: { hinge: HingeType.LEFT, state: DoorState.OPENED, actionId: 1516 },

        1519: { hinge: HingeType.RIGHT, state: DoorState.CLOSED, actionId: 1520 },
        1520: { hinge: HingeType.RIGHT, state: DoorState.OPENED, actionId: 1519 },

        1530: { hinge: HingeType.RIGHT, state: DoorState.CLOSED, actionId: 1531 },
        1531: { hinge: HingeType.RIGHT, state: DoorState.OPENED, actionId: 1530 },

        1533: { hinge: HingeType.LEFT, state: DoorState.CLOSED, actionId: 1534 },
        1534: { hinge: HingeType.LEFT, state: DoorState.OPENED, actionId: 1533 },

        1536: { hinge: HingeType.LEFT, state: DoorState.CLOSED, actionId: 1537 },
        1537: { hinge: HingeType.LEFT, state: DoorState.OPENED, actionId: 1536 },

        4465: { hinge: HingeType.RIGHT, state: DoorState.CLOSED, actionId: 4466 },
        4466: { hinge: HingeType.RIGHT, state: DoorState.OPENED, actionId: 4465 },
    }
}



export class DoorAction {
    // Translates a door's position in the direction of its orientation.
    private static translate_door_position(doorDefinition: DoorDefinition, doorObject: MapObject): Position {
        const offset = Doors.PositionTranslation[doorDefinition.state][doorObject.rotation];
        return new Position(doorObject.position.getX() + offset.x, doorObject.position.getY() + offset.y);

        let xOffset = 0;
        let yOffset = 0;
        if (doorObject.rotation == Orientation.WEST) xOffset = -1;
        else if (doorObject.rotation == Orientation.EAST) xOffset = 1;
        else if (doorObject.rotation == Orientation.NORTH) yOffset = 1;
        else if (doorObject.rotation == Orientation.SOUTH) yOffset = -1;
        
        if (doorDefinition.state == DoorState.OPENED) {
            xOffset *= -1;
            yOffset *= -1;
        }
        
        return new Position(doorObject.position.getX() + xOffset, doorObject.position.getY() + yOffset);
    }

    // Translates the orientation of a door to a toggled position.
    private static translate_door_orientation(doorDefinition: DoorDefinition, doorObject: MapObject): Orientation {
        return Doors.RotationTranslation[doorDefinition.state][doorDefinition.hinge][doorObject.rotation];
        
        if (doorDefinition.state == DoorState.CLOSED) {
            if (doorDefinition.hinge == HingeType.LEFT) {
                if (doorObject.rotation == Orientation.NORTH) return Orientation.WEST;
                else if (doorObject.rotation == Orientation.SOUTH) return Orientation.EAST;
                else if (doorObject.rotation == Orientation.WEST) return Orientation.SOUTH;
                else if (doorObject.rotation == Orientation.EAST) return Orientation.NORTH;
            }
            else if (doorDefinition.hinge == HingeType.RIGHT) {
                if (doorObject.rotation == Orientation.NORTH) return Orientation.EAST;
                else if (doorObject.rotation == Orientation.SOUTH) return Orientation.WEST;
                else if (doorObject.rotation == Orientation.WEST) return Orientation.NORTH;
                else if (doorObject.rotation == Orientation.EAST) return Orientation.SOUTH;
            }
        }
        else if (doorDefinition.state == DoorState.OPENED) {
            if (doorDefinition.hinge == HingeType.RIGHT) {
                if (doorObject.rotation == Orientation.NORTH) return Orientation.WEST;
                else if (doorObject.rotation == Orientation.SOUTH) return Orientation.EAST;
                else if (doorObject.rotation == Orientation.WEST) return Orientation.SOUTH;
                else if (doorObject.rotation == Orientation.EAST) return Orientation.NORTH;
            }
            else if (doorDefinition.hinge == HingeType.LEFT) {
                if (doorObject.rotation == Orientation.NORTH) return Orientation.EAST;
                else if (doorObject.rotation == Orientation.SOUTH) return Orientation.WEST;
                else if (doorObject.rotation == Orientation.WEST) return Orientation.NORTH;
                else if (doorObject.rotation == Orientation.EAST) return Orientation.SOUTH;
            }
        }
  
        return null;
    }

    private static isDoor(objectId: number): boolean {
        if (Doors.Definitions[objectId]) return true;
        return false;
    }

    private static isOpen(doorDefinition: DoorDefinition): boolean {
        return doorDefinition.state == DoorState.OPENED;
    }

    private static OpenDoor(doorMapObject: MapObject, doorDefinition: DoorDefinition) {
        GameService.getInstance().map.removeMapObject(doorMapObject);

        const newDoorId = doorDefinition.actionId;
        const actionLandscapeItem = new MapObject(
            newDoorId,
            DoorAction.translate_door_position(doorDefinition, doorMapObject),
            doorMapObject.type,
            DoorAction.translate_door_orientation(doorDefinition, doorMapObject)
        )
        GameService.getInstance().map.addMapObject(actionLandscapeItem);
    }

    private static CloseDoor(doorMapObject: MapObject, doorDefinition: DoorDefinition) {
        GameService.getInstance().map.removeMapObject(doorMapObject);

        const newDoorId = doorDefinition.actionId;
        
        const newDoor = new MapObject(
            newDoorId,
            doorMapObject.position,
            doorMapObject.type,
            DoorAction.translate_door_orientation(doorDefinition, doorMapObject)
        );

        const actionLandscapeItem = new MapObject(
            newDoor.id,
            DoorAction.translate_door_position(doorDefinition, newDoor),
            newDoor.type,
            newDoor.rotation
        )
        GameService.getInstance().map.addMapObject(actionLandscapeItem);
    }

    public static ToggleDoor(player: Player, objectId: number, x: number, y: number) {
        if (!DoorAction.isDoor(objectId)) {
            console.log(`Object ${objectId} is not a door.`);
            return;
        }

        const doorDefinition = Doors.Definitions[objectId];
        const doorMapObject = GameService.getInstance().map.getMapObject(objectId, new Position(x, y));

        if (!doorMapObject) {
            console.log("Could not find door in map.");
            return;
        }

        player.movementHandler.waitForCharacterToReachPosition(doorMapObject.position, 1).then(reached => {
            if (!reached) {
                console.log("Failed to reach position.");
                return;
            }
    
            if (DoorAction.isOpen(doorDefinition)) {
                DoorAction.CloseDoor(doorMapObject, doorDefinition);
            }
            else {
                DoorAction.OpenDoor(doorMapObject, doorDefinition);
            }
        });
    }
}