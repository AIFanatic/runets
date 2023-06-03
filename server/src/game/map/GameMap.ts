import { WorldItem } from "../entities/definitions/WorldItem";
import { Position } from "../entities/Position";
import { MapObject } from "./MapObject";

import Quadtree, { QuadtreeItem } from "quadtree-lib";
import { DataService } from "@runeserver-ts/service/DataService";
import { Player } from "../entities/characters/player/Player";
import { GameService } from "@runeserver-ts/service/GameService";

enum BroadcastType {
    ADD,
    REMOVE,
};

interface MapItem {
    x: number;
    y: number;
    width: number;
    height: number;
    mapObject: MapObject;
};

interface PlayerTree {
    x: number;
    y: number;
    width: number;
    height: number;
    player: Player;
};

export class GameMap {
    private quadtreePlayers: Quadtree<PlayerTree>;
    private quadtree: Quadtree<MapItem>;

    constructor() {
        this.quadtree = new Quadtree({
            width: 10000, height: 10000
        });

        this.quadtreePlayers = new Quadtree({
            width: 10000, height: 10000
        });
    }

    private boundingBoxCollisionFromCenter(a: QuadtreeItem, b: QuadtreeItem): boolean {
        const ax1 = a.x - a.width / 2;
        const ay1 = a.y - a.height / 2;
    
        const bx1 = b.x - b.width / 2;
        const by1 = b.y - b.height / 2;

        return !(
            ay1 + a.height <= by1 ||
            ay1 >= by1 + b.height ||
            ax1 + a.width <= bx1 ||
            ax1 >= bx1 + b.width
        );
    }

    private broadcastMapObject(mapObject: MapObject, type: BroadcastType) {
        const collidingPlayers = this.quadtreePlayers.colliding({
            x: mapObject.position.getX(),
            y: mapObject.position.getY(),
            width: 1,
            height: 1
        }, this.boundingBoxCollisionFromCenter)

        for (let player of collidingPlayers) {
            if (type == BroadcastType.ADD) {
                player.player.outgoingPacketHandler.setMapObject(mapObject);
            }
            else if (type == BroadcastType.REMOVE) {
                player.player.outgoingPacketHandler.removeMapObject(mapObject);
            }
        }
    }

    public addMapObject(mapObject: MapObject, shouldBroadcast: boolean = true) {
        this.quadtree.push({
            x: mapObject.position.getX(),
            y: mapObject.position.getY(),
            width: 1,
            height: 1,
            mapObject: mapObject
        });

        this.broadcastMapObject(mapObject, BroadcastType.ADD);
    }

    public removeMapObject(mapObject: MapObject) {
        this.quadtree.find(entry => {
            if (entry.mapObject.id === mapObject.id && entry.x === mapObject.position.getX() && entry.y == mapObject.position.getY()) {
                this.quadtree.remove(entry);
                this.broadcastMapObject(mapObject, BroadcastType.REMOVE);

                return true;
            }
            return false;
        });
    }

    public getMapObject(id: number, position: Position): MapObject {
        const entries = this.quadtree.find(entry => {
            return entry.mapObject.id === id && entry.x === position.getX() && entry.y == position.getY();
        });

        if (entries.length > 0) {
            return entries[0].mapObject;
        }

        const key = `${id},${position.getX()},${position.getY()}`;
        const mapObject = DataService.getInstance().mapObjects.get(key);

        if (!mapObject) {
            throw Error(`Map object not found in cache ${key}.`);
        }

        this.addMapObject(mapObject, false);
        
        return mapObject;
    }

    public update() {
        this.quadtreePlayers.clear();

        const players = GameService.getInstance().getPlayers();

        for (let player of players) {
            this.quadtreePlayers.push({
                x: player.position.getX(),
                y: player.position.getY(),
                width: 100,
                height: 100,
                player: player
            })
        }
    }
}