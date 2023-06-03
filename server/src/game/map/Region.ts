import { GameService } from "@runeserver-ts/service/GameService";
import { WorldItem } from "@runeserver-ts/game/entities/definitions/WorldItem";
import { MapObject } from "@runeserver-ts/game/map/MapObject";
import { DataService } from "@runeserver-ts/service/DataService";

export class Region {
    public readonly regionX: number;
    public readonly regionY: number;
    private regionItems: Map<string, WorldItem[]>;
    private regionMapObjects: Map<string, MapObject[]>;

    constructor(regionX: number, regionY: number) {
        this.regionX = regionX;
        this.regionY = regionY;
        this.regionItems = new Map();
        this.regionMapObjects = new Map();
    }

    public addItem(worldItem: WorldItem, shouldBroadcast: boolean = true) {
        const positionKey = `${worldItem.position.getX()},${worldItem.position.getY()}}`;

        const existingItems = this.regionItems.has(positionKey) ? this.regionItems.get(positionKey) : [];
        existingItems.push(worldItem);

        this.regionItems.set(positionKey, existingItems);

        if (shouldBroadcast) {
            const players = GameService.getInstance().map.getPlayersByRegion(this.regionX, this.regionY);
            for(let player of players) {
                player.outgoingPacketHandler.setWorldItem(worldItem);
            }
        }
    }

    public removeItem(worldItem: WorldItem) {
        const positionKey = `${worldItem.position.getX()},${worldItem.position.getY()}}`;

        let worldItemList = this.regionItems.get(positionKey);
        if (worldItemList) {
            const worldItemIndex = worldItemList.indexOf(worldItem);
            if (worldItemIndex == -1) return false;
            worldItemList.splice(worldItemIndex, 1);
            this.regionItems.set(positionKey, worldItemList);

            const players = GameService.getInstance().map.getPlayersByRegion(this.regionX, this.regionY);
            for(let player of players) {
                player.outgoingPacketHandler.removeWorldItem(worldItem);
            }
        }
    }

    public getItems(): Map<string, WorldItem[]> {
        return this.regionItems;
    }

    public getItem(id: number, x: number, y: number): WorldItem {
        const positionKey = `${x},${y}}`;

        const regionItems = this.regionItems.get(positionKey);
        if (regionItems) {
            for (let worldItem of regionItems) {
                if (worldItem.itemId == id && worldItem.position.getX() == x && worldItem.position.getY() == y) {
                    return worldItem;
                }
            }
        }

        return null;
    }





    public addMapObject(mapObject: MapObject, shouldBroadcast: boolean = true) {
        const positionKey = `${mapObject.position.getX()},${mapObject.position.getY()}}`;

        const existingItems = this.regionMapObjects.has(positionKey) ? this.regionMapObjects.get(positionKey) : [];
        existingItems.push(mapObject);

        this.regionMapObjects.set(positionKey, existingItems);

        if (shouldBroadcast) {
            const players = GameService.getInstance().map.getPlayersByRegion(this.regionX, this.regionY);
            for(let player of players) {
                player.outgoingPacketHandler.setMapObject(mapObject);
            }
        }
    }

    public removeMapObject(mapObject: MapObject) {
        const positionKey = `${mapObject.position.getX()},${mapObject.position.getY()}}`;

        let mapObjectList = this.regionMapObjects.get(positionKey);
        console.log("positionKey", positionKey);
        console.log(mapObjectList)
        if (mapObjectList) {
            const mapObjectIndex = mapObjectList.indexOf(mapObject);
            console.log(mapObjectList, mapObjectIndex)
            if (mapObjectIndex === -1) return false;
            console.log("HERE3")
            mapObjectList.splice(mapObjectList.indexOf(mapObject), 1);
            this.regionMapObjects.set(positionKey, mapObjectList);

            const players = GameService.getInstance().map.getPlayersByRegion(this.regionX, this.regionY);
            console.log("HERE4", players)
            for(let player of players) {
                console.log("HERE2");
                player.outgoingPacketHandler.removeMapObject(mapObject);
            }
        }
    }

    public getMapObjects(): Map<string, MapObject[]> {
        return this.regionMapObjects;
    }

    public getMapObject(id: number, x: number, y: number): MapObject {
        const positionKey = `${x},${y}}`;

        const regionLandscapeItems = this.regionMapObjects.get(positionKey);
        if (regionLandscapeItems) {
            for (let landscapeItem of regionLandscapeItems) {
                if (landscapeItem.id == id && landscapeItem.position.getX() == x && landscapeItem.position.getY() == y) {
                    return landscapeItem;
                }
            }
        }

        // Try to get item from cache instead
        const key = `${id},${x},${y}`;
        if (DataService.getInstance().mapObjects.has(key)) {
            console.log("Door not added to region, adding");
            const mapObject = DataService.getInstance().mapObjects.get(key);
            this.addMapObject(mapObject, false);
            return mapObject;
        }

        return null;
    }
}