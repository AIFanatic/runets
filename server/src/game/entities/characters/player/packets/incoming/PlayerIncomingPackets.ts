import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { Action } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/Action";
import { NotImplemented } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/NotImplemented";
import { ButtonAction } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/ButtonAction";
import { WalkAction } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/WalkAction";
import { ItemEquip } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/ItemEquip";
import { FirstOptionClickAction } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/FirstOptionClickAction";
import { NpcInteraction } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/NpcInteraction";
import { ObjectInteraction } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/ObjectInteraction";
import { MouseClicked } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/MouseClicked";
import { TakeTileItem } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/TakeTileItem";
import { DropItem } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/DropItem";
import { CameraTurnAction } from "@runeserver-ts/game/entities/characters/player/packets/incoming/action/CameraTurnAction";

const incomingPacketSizes: number[] = [
    0, 12, 0, 6, 6, 0, 0, 0, 2, 0, // 0
    0, 0, 0, 2, 0, 0, 0, 0, 0, 4, // 10
    0, 0, 2, 0, 6, 0, 0, 0, -1, 0, // 20
    0, 4, 0, 0, 0, 0, 8, 0, 0, 0, // 30
    0, 0, 2, 0, 0, 2, 0, 0, 0, -1, // 40
    6, 0, 0, 0, 6, 6, -1, 8, 0, 0, // 50
    0, 0, 0, 0, 0, 0, 0, 2, 0, 0, // 60
    0, 6, 0, 0, 0, 4, 0, 6, 4, 2, // 70
    2, 0, 0, 8, 0, 0, 0, 0, 0, 0, // 80
    0, 6, 0, 0, 0, 4, 0, 0, 0, 0, // 90
    6, 0, 0, 0, 4, 0, 0, 0, 0, 0, // 100
    0, 0, 2, 0, 0, 0, 2, 0, 0, 1, // 110
    8, 0, 0, 7, 0, 0, 1, 0, 0, 0, // 120
    0, 0, 0, 0, 0, 0, 6, 0, 0, 0, // 130
    4, 8, 0, 8, 0, 0, 0, 0, 0, 0, // 140
    0, 0, 12, 0, 0, 0, 0, 4, 6, 0, // 150
    8, 6, 0, 13, 0, 1, 0, 0, 0, 0, // 160
    0, -1, 0, 3, 0, 0, 3, 6, 0, 0, // 170
    0, 6, 0, 0, 10, 0, 0, 1, 0, 0, // 180
    0, 0, 0, 0, 2, 0, 0, 4, 0, 0, // 190
    0, 0, 0, 6, 0, 0, 8, 0, 0, 0, // 200
    8, 12, 0, -1, 0, 0, 0, 8, 0, 0, // 210
    0, 0, 3, 0, 0, 0, 2, 9, 6, 0, // 220
    6, 6, 0, 2, 0, 0, 0, 0, 0, 0, // 230
    0, 6, 0, 0, -1, 2, 0, -1, 0, 0, // 240
    0, 0, 0, 0, 0, 0 // 250
];

const packets: { [key: number]: Action } = {
    19:  MouseClicked,
    140: CameraTurnAction,

    79:  ButtonAction,
    226: NotImplemented,

    112: NpcInteraction,
    13:  NpcInteraction,
    42:  NpcInteraction,
    8:   NpcInteraction,
    67:  NpcInteraction,

    181: ObjectInteraction,
    241: ObjectInteraction,
    50:  ObjectInteraction,
    136: ObjectInteraction,
    55:  ObjectInteraction,

    28:  WalkAction,
    213: WalkAction,
    247: WalkAction,

    163: NotImplemented,

    24:  ItemEquip,
    3:   FirstOptionClickAction,
    123: NotImplemented,
    4:   DropItem,
    1:   NotImplemented,

    49:  NotImplemented,
    56:  NotImplemented,

    177: NotImplemented,
    91:  NotImplemented,
    231: NotImplemented,

    203: FirstOptionClickAction,

    71: TakeTileItem
};

/**
 * Parses incoming packet data from the game client once the user is fully authenticated.
 */
export class PlayerIncomingPackets {
    private readonly player: Player;

    private activePacketId: number = null;
    private activePacketSize: number = null;
    private activeBuffer: StreamBuffer;

    public constructor(player: Player) {
        this.player = player;
    }

    private static HandlePacket(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer): void {
        const packetFunction = packets[packetId];
    
        if(!packetFunction) {
            console.log(`Unknown packet ${packetId} with size ${packetSize} received.`);
            return;
        }
    
        // new Promise(resolve => {
            packetFunction.Process(player, packetId, packetSize, buffer);
        //     resolve();
        // });
    }

    public parse(buffer?: StreamBuffer): void {
        if(!this.activeBuffer) {
            this.activeBuffer = buffer;
        } else if(buffer) {
            const newBuffer = new StreamBuffer(this.activeBuffer.getUnreadData());
            const activeLength = newBuffer.getBuffer().length;
            newBuffer.ensureCapacity(activeLength + buffer.getBuffer().length);
            buffer.getBuffer().copy(newBuffer.getBuffer(), activeLength, 0);
            this.activeBuffer = newBuffer;
        }

        if(this.activePacketId === null) {
            this.activePacketId = -1;
        }

        if(this.activePacketSize === null) {
            this.activePacketSize = -1;
        }

        const inCipher = this.player.client.getDecryptor();

        if(this.activePacketId === -1) {
            if(this.activeBuffer.getReadable() < 1) {
                return;
            }

            this.activePacketId = this.activeBuffer.readByte() & 0xff;
            this.activePacketId = (this.activePacketId - inCipher.rand()) & 0xff;
            this.activePacketSize = incomingPacketSizes[this.activePacketId];
        }

        if(this.activePacketSize === -1) {
            if(this.activeBuffer.getReadable() < 1) {
                return;
            }

            this.activePacketSize = this.activeBuffer.readByte() & 0xff;
        }

        if(this.activeBuffer.getReadable() < this.activePacketSize) {
            console.error('Not enough readable data for packet ' + this.activePacketId + ' with size ' + this.activePacketSize + ', but only ' +
                this.activeBuffer.getReadable() + ' data is left of ' + this.activeBuffer.getBuffer().length);
            return;
        }

        if(this.activePacketSize !== 0) {
            // read packet data
            const packetData = this.activeBuffer.readBytes(this.activePacketSize);
            PlayerIncomingPackets.HandlePacket(this.player, this.activePacketId, this.activePacketSize, new StreamBuffer(packetData));
        }

        this.activePacketId = null;
        this.activePacketSize = null;

        if(this.activeBuffer.getReadable() > 0) {
            this.parse();
        }
    }
}
