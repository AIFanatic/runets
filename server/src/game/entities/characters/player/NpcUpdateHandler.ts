import { Packet, PacketType } from "@runeserver-ts/net/Packet";
import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";

import { Tickable } from "@runeserver-ts/util/Tickable";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { Npc } from "@runeserver-ts/game/entities/characters/npc/Npc";
import { CharacterUpdating } from "@runeserver-ts/game/entities/characters/CharacterUpdating";
import { CharacterTracker, CharacterTrackingType } from "@runeserver-ts/game/entities/characters/CharacterTracker";

export class NpcUpdateHandler implements Tickable {
    private player: Player;
    private npcTracker: CharacterTracker;
    
    constructor(player: Player) {
        this.player = player;
        this.npcTracker = new CharacterTracker(this.player, CharacterTrackingType.NPC);
    }

    public update() {
        this.npcTracker.update();
    }

    public lateUpdate() {
        const npcUpdatePacket: Packet = new Packet(71, PacketType.DYNAMIC_LARGE);
        const updateMaskData = StreamBuffer.create();

        npcUpdatePacket.openBitChannel();
        
        this.appendNewNpcs(npcUpdatePacket, updateMaskData);
        
        if(updateMaskData.getWriterIndex() !== 0) {
            npcUpdatePacket.writeBits(14, 16383);
            npcUpdatePacket.closeBitChannel();

            npcUpdatePacket.writeBytes(updateMaskData);
        } else {
            // No npc updates were appended, so just end the packet here
            npcUpdatePacket.closeBitChannel();
        }

        this.player.client.send(npcUpdatePacket);
    }

    private appendNewNpcs(packet: StreamBuffer, updateMaskData: StreamBuffer) {
        packet.writeBits(8, this.npcTracker.getRegisteredCount()); // Tracked mob count
   
        const trackedCharacters = this.npcTracker.getTracked();
        for (let trackedCharacterPair of trackedCharacters) {
            const npcCharacter = trackedCharacterPair[0] as Npc;
            const isRegistered = trackedCharacterPair[1];  
            
            if (!isRegistered) {
                this.appendAddNpcUpdate(npcCharacter, packet);
                this.appendUpdateMaskData(npcCharacter, updateMaskData);

                // TODO: Remove this from here
                this.npcTracker.register(npcCharacter);

                continue;
            }

            if(npcCharacter.position.isViewableFrom(this.player.position)) {
                // console.log("Appending movement for", npcCharacter.config.name)
                CharacterUpdating.appendMovement(npcCharacter, packet);
                this.appendUpdateMaskData(npcCharacter, updateMaskData);
            } else {
                this.removeNpcUpdate(packet);
                // TODO: Remove this from here
                this.npcTracker.remove(npcCharacter);
            }
        }
    }

    private appendAddNpcUpdate(npc: Npc, packet: StreamBuffer) {
        const positionOffsetX = npc.position.getX() - this.player.position.getX();
        const positionOffsetY = npc.position.getY() - this.player.position.getY();
        
        // Notify the client of the new npc and their slot in the npc list
        packet.writeBits(14, npc.getSlot());
        packet.writeBits(1, npc.updateFlags.updateBlockRequired ? 1 : 0); // Update is required
        packet.writeBits(5, positionOffsetY); // World Position Y axis offset relative to the player
        packet.writeBits(5, positionOffsetX); // World Position X axis offset relative to the player
        packet.writeBits(1, 1); // Discard client walking queues
        packet.writeBits(13, npc.definition.id);
    }

    private removeNpcUpdate(packet: StreamBuffer) {
        packet.writeBits(1, 1);
        packet.writeBits(2, 3);
    }

    private appendUpdateMaskData(npc: Npc, updateMaskData: StreamBuffer): void {
        const updateFlags = npc.updateFlags;
        if(!updateFlags.updateBlockRequired) {
            return;
        }

        let mask = 0;

        if(updateFlags.transform !== undefined) {
            mask |= 0x1;
        }
        if(updateFlags.faceMob !== undefined) {
            mask |= 0x40;
        }
        if(updateFlags.primaryHit !== undefined) {
            mask |= 0x80;
        }
        // if(updateFlags.graphics !== undefined) {
        //     mask |= 0x4;
        // }
        if(updateFlags.chatMessages.length !== 0) {
            mask |= 0x20;
        }
        if(updateFlags.facePosition) {
            mask |= 0x8;
        }
        if(updateFlags.animation) {
            mask |= 0x2;
        }
        // if(updateFlags.secondaryHit !== undefined) {
        //     mask |= 0x10;
        // }

        updateMaskData.writeUnsignedByte(mask);

        if(updateFlags.transform !== undefined) {
            this.appendTransform(npc, updateMaskData);
        }

        if(updateFlags.faceMob !== undefined) {
            this.appendFaceMob(npc, updateMaskData);
        }
        
        if(updateFlags.primaryHit !== undefined) {
            this.appendPrimaryHit(npc, updateMaskData);
        }

        // if(updateFlags.graphics !== undefined) {
        //     this.appendGraphics(npc, updateMaskData);
        // }

        if(updateFlags.chatMessages.length !== 0) {
            this.appendChatMessages(npc, updateMaskData);
        }

        if(updateFlags.facePosition) {
            this.appendFacePosition(npc, updateMaskData);
        }

        if(updateFlags.animation) {
            this.appendAnimation(npc, updateMaskData);
        }

        // if(updateFlags.secondaryHit !== undefined) {
        //     this.appendSecondaryHit(npc, updateMaskData);
        // }
    }

    private appendTransform(npc: Npc, updateMaskData: StreamBuffer) {
        // builder.put(DataType.SHORT, DataTransformation.ADD, block.getId());
        updateMaskData.writeUnsignedShortLE(npc.updateFlags.transform.id);
    }

    private appendFaceMob(npc: Npc, updateMaskData: StreamBuffer) {
        const mob = npc.updateFlags.faceMob;

        if(mob === null) {
            // Reset faced mob
            updateMaskData.writeUnsignedShortLE(65535);
        } else {
            let mobIndex = mob.worldIndex;

            if(mob instanceof Player) {
                // Client checks if index is less than 32768.
                // If it is, it looks for an NPC.
                // If it isn't, it looks for a player (subtracting 32768 to find the index).
                mobIndex += 32768 + 1;
            }

            updateMaskData.writeUnsignedShortLE(mobIndex);
        }
    }

    private appendPrimaryHit(npc: Npc, updateMaskData: StreamBuffer) {
		// builder.put(DataType.BYTE, DataTransformation.SUBTRACT, block.getDamage());
		// builder.put(DataType.BYTE, DataTransformation.SUBTRACT, block.getType());
		// builder.put(DataType.BYTE, block.getCurrentHealth());
		// builder.put(DataType.BYTE, DataTransformation.NEGATE, block.getMaximumHealth());
        updateMaskData.writeOffsetByte(npc.updateFlags.primaryHit.damage);
        updateMaskData.writeOffsetByte(npc.updateFlags.primaryHit.type);
        updateMaskData.writeByte(npc.updateFlags.primaryHit.health);
        updateMaskData.writeNegativeOffsetByte(npc.updateFlags.primaryHit.maxHealth);
    }

    private appendGraphics(npc: Npc, updateMaskData: StreamBuffer) {
    }

    private appendChatMessages(npc: Npc, updateMaskData: StreamBuffer) {
        const message = npc.updateFlags.chatMessages[0];

        if(message.message) {
            updateMaskData.writeString(message.message);
        } else {
            updateMaskData.writeString('Undefined Message');
        }
    }

    private appendFacePosition(npc: Npc, updateMaskData: StreamBuffer) {
        const position = npc.updateFlags.facePosition;

        updateMaskData.writeOffsetShortLE(position.getX() * 2 + 1);
        updateMaskData.writeShortLE(position.getY() * 2 + 1);
    }

    private appendAnimation(npc: Npc, updateMaskData: StreamBuffer) {
        const animation = npc.updateFlags.animation;

        if(animation === null || animation.id === -1) {
            // Reset animation
            updateMaskData.writeShortBE(-1);
            updateMaskData.writeNegativeOffsetByte(0);
        } else {
            const delay = npc.updateFlags.animation.delay || 0;
            updateMaskData.writeShortBE(animation.id);
            updateMaskData.writeNegativeOffsetByte(delay);
        }
    }

    private appendSecondaryHit(npc: Npc, updateMaskData: StreamBuffer) {
    }
}