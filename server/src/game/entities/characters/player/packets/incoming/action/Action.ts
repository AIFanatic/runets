import { StreamBuffer } from "../../../../../../net/StreamBuffer";
import { Player } from "../../../Player";

export interface Action {
    Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer)
};