import { Service } from "@runeserver-ts/service/Service";
import { Client } from "@runeserver-ts/game/client/Client";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { Npc } from "@runeserver-ts/game/entities/characters/npc/Npc";
import { NpcDefinition } from "@runeserver-ts/game/entities/definitions/NpcDefinition";
import { DataService } from "./DataService";
import { Position } from "@runeserver-ts/game/entities/Position";
import { GameMap } from "@runeserver-ts/game/map/GameMap";

export class GameService implements Service {
    private static instance: GameService;

    public static readonly MAX_PLAYERS = 2000;
    public static readonly MAX_NPCS = 10000;

    private players: Map<number, Player>;
    private npcs: Map<number, Npc>;

    public readonly map: GameMap;

    private constructor() {
        this.players = new Map();
        this.npcs = new Map();
        this.map = new GameMap();

        global.GameService = this;
        global.Position = Position;
    }
    
    public init() {
        console.log("Started GameServer service.");

        this.spawnNpcs();
    }

    private spawnNpcs() {
        for (let npcDefinition of DataService.getInstance().npcs) {
            this.createNpc(npcDefinition[1]);
        }
    }

    public tick() {
        try {
            // console.time("tick");
            
            this.map.update();

            this.players.forEach(player => player.update());
            this.npcs.forEach(npc => npc.update());

            this.players.forEach(player => player.lateUpdate());
            this.npcs.forEach(npc => npc.lateUpdate());

            this.players.forEach(player => player.reset());
            this.npcs.forEach(npc => npc.reset());
            
            // console.timeEnd("tick");
        } catch (error) {
            console.error(error);
        }
    }

    public cleanup() {
        for (let player of this.players.values()) {
            player.stopSession();
        }
    }


    public createPlayer(client: Client, userId: number, username: string, password: string): Player {
        const newPlayer = true;
        const player = new Player(client);
        player.attributes.setUserId(userId);
        player.attributes.setUsername(username);
        player.attributes.setPassword(password);

        if (this.playerExists(player)) {
            console.error("Player is already registered");
            return;
        }
        
        this.registerPlayer(player);
        player.initSession(newPlayer);
        // TODO: Send existing world items

        return player;
    }
    
    public playerExists(player: Player): boolean {
        const _player = this.players.get(player.getSlot());
        
        if (!_player) return false;
        if (!_player.equals(player)) return false; 

        return true;
    }

    private registerPlayer(player: Player): number {
        if (this.players.size > GameService.MAX_PLAYERS) {
            console.log("World is full");
            return -1;
        }
        const slot = this.players.size;
        player.setSlot(slot);
        this.players.set(slot, player);
        
        return slot;
    }

    public removePlayer(player: Player): boolean {
        // TODO: Save data
        this.players.delete(player.getSlot());

        return true;
    }

    public createNpc(config: NpcDefinition): Npc {
        const npc = new Npc(config);
        this.registerNpc(npc);

        return npc;
    }

    public npcExists(npc: Npc): boolean {
        const _npc = this.npcs.get(npc.getSlot());
        
        if (!_npc) return false;
        if (!_npc.equals(npc)) return false; 

        return true;
    }

    private registerNpc(npc: Npc): number {
        if (this.npcs.size > GameService.MAX_NPCS) {
            console.log("World is full");
            return -1;
        }
        const slot = this.npcs.size;
        npc.setSlot(slot);
        this.npcs.set(slot, npc);
        
        return slot;
    }

    public static getInstance(): GameService {
        if (!GameService.instance) {
            GameService.instance = new GameService();
        }
        return GameService.instance;
    }

    public getPlayers(): Player[] {
        // TODO: Clean
        let players = new Array<Player>();
        this.players.forEach(player => players.push(player));
        return players;
    }

    public getNpcs(): Npc[] {
        // TODO: Clean
        let npcs = new Array<Npc>();
        this.npcs.forEach(npc => npcs.push(npc));
        return npcs;
    }
}