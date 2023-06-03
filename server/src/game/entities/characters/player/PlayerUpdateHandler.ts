import { Packet, PacketType } from "@runeserver-ts/net/Packet";
import { StreamBuffer, stringToLong } from "@runeserver-ts/net/StreamBuffer";

import { Tickable } from "@runeserver-ts/util/Tickable";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";
import { CharacterUpdating } from "@runeserver-ts/game/entities/characters/CharacterUpdating";
import { CharacterTracker, CharacterTrackingType } from "@runeserver-ts/game/entities/characters/CharacterTracker";
import { EquipmentSlot, Inventory } from "@runeserver-ts/game/entities/characters/Inventory";
import { GameService } from "@runeserver-ts/service/GameService";

export class PlayerUpdateHandler implements Tickable {
    private player: Player;
    private playerTracker: CharacterTracker;
    
    constructor(player: Player) {
        this.player = player;
        this.playerTracker = new CharacterTracker(this.player, CharacterTrackingType.PLAYER);
    }

    public update() {
        this.playerTracker.update();
    }

    public lateUpdate() {
        const playerUpdatePacket: Packet = new Packet(90, PacketType.DYNAMIC_LARGE, 16);
        playerUpdatePacket.openBitChannel();

        const updateMaskData = StreamBuffer.create();

        if(this.player.updateFlags.mapRegionUpdateRequired) {
            this.appendUpdateMapRegionChanged(this.player, playerUpdatePacket);
        } else {
            CharacterUpdating.appendMovement(this.player, playerUpdatePacket);
        }

        this.appendUpdateMaskData(this.player, updateMaskData, false, true);
        this.appendNewPlayers(playerUpdatePacket, updateMaskData);

        if(updateMaskData.getWriterIndex() !== 0) {
            playerUpdatePacket.writeBits(11, 2047);
            playerUpdatePacket.closeBitChannel();

            playerUpdatePacket.writeBytes(updateMaskData);
        } else {
            // No player updates were appended, so just end the packet here
            playerUpdatePacket.closeBitChannel();
        }

        this.player.client.send(playerUpdatePacket);
    }

    private appendNewPlayers(packet: StreamBuffer, updateMaskData: StreamBuffer) {
        packet.writeBits(8, this.playerTracker.getRegisteredCount()); // 0 == trackMobs.length

        const trackedCharacters = this.playerTracker.getTracked();
        for (let trackedCharacterPair of trackedCharacters) {
            const otherPlayer = trackedCharacterPair[0] as Player;
            const isRegistered = trackedCharacterPair[1];  

            if (!GameService.getInstance().playerExists(otherPlayer)) {
                packet.writeBits(1, 1);
                packet.writeBits(2, 3);
                this.playerTracker.remove(otherPlayer);
                continue;
            }
            
            if (!isRegistered) {
                const positionOffsetX = otherPlayer.position.getX() - this.player.position.getX();
                const positionOffsetY = otherPlayer.position.getY() - this.player.position.getY();
                
                // console.log(`Registered ${otherPlayer.attributes.getUsername()}[${otherPlayer.attributes.getUserId()}] at ${positionOffsetX}, ${positionOffsetY}`);

                // Notify the client of the new npc and their slot in the npc list
                packet.writeBits(11, otherPlayer.getSlot());
                packet.writeBits(5, positionOffsetX); // World Position X axis offset relative to the player
                packet.writeBits(1, otherPlayer.updateFlags.updateBlockRequired ? 1 : 0); // Update is required
                packet.writeBits(1, 1); // Discard client walking queues
                packet.writeBits(5, positionOffsetY); // World Position Y axis offset relative to the player

                this.appendUpdateMaskData(otherPlayer, updateMaskData, true);

                this.playerTracker.register(otherPlayer);

                continue;
            }

            if(otherPlayer.position.isViewableFrom(this.player.position)) {
                CharacterUpdating.appendMovement(otherPlayer, packet);
                this.appendUpdateMaskData(otherPlayer, updateMaskData);
            } else {
                packet.writeBits(1, 1);
                packet.writeBits(2, 3);
                this.playerTracker.remove(otherPlayer);
            }
        }
    }

    private appendUpdateMapRegionChanged(player: Player, packet: StreamBuffer) {
        const posX = player.position.regionLocalX;
        const posY = player.position.regionLocalY;
        const posZ = player.position.getZ();

        packet.writeBits(1, 1); // Update Required
        packet.writeBits(2, 3); // Map Region changed
        packet.writeBits(1, 0); //packet.writeBits(1, player.metadata['teleporting'] ? 1 : 0); // Whether or not the client should discard the current walking queue (1 if teleporting, 0 if not)
        packet.writeBits(2, posZ); // Player Height
        packet.writeBits(7, posY); // Player Local Chunk Y
        packet.writeBits(7, posX); // Player Local Chunk X
        packet.writeBits(1, player.updateFlags.updateBlockRequired ? 1 : 0); // Whether or not an update flag block follows
    }

    private appendUpdateMaskData(player: Player, updateMaskData: StreamBuffer, forceUpdate?: boolean, currentPlayer?: boolean): void {
        const updateFlags = player.updateFlags;

        if(!updateFlags.updateBlockRequired && !forceUpdate) {
            return;
        }

        let mask: number = 0;

        if(updateFlags.appearanceUpdateRequired || forceUpdate) {
            mask |= 0x4;
        }
        if(updateFlags.faceMob !== undefined) {
            mask |= 0x1;
        }
        if(updateFlags.facePosition || forceUpdate) {
            mask |= 0x2;
        }
        if(updateFlags.chatMessages.length !== 0 && !currentPlayer) {
            mask |= 0x40;
        }
        if(updateFlags.graphics) {
            mask |= 0x200;
        }
        if(updateFlags.animation !== undefined) {
            mask |= 0x8;
        }

        if(mask >= 0xff) {
            mask |= 0x20;
            updateMaskData.writeByte(mask & 0xff);
            updateMaskData.writeByte(mask >> 8);
        } else {
            updateMaskData.writeByte(mask);
        }

        if(updateFlags.animation !== undefined) {
            const animation = updateFlags.animation;

            if(animation === null || animation.id === -1) {
                // Reset animation
                updateMaskData.writeShortBE(-1);
                updateMaskData.writeNegativeOffsetByte(0);
            } else {
                const delay = updateFlags.animation.delay || 0;
                updateMaskData.writeShortBE(updateFlags.animation.id);
                updateMaskData.writeNegativeOffsetByte(delay);
            }
        }

        if(updateFlags.chatMessages.length !== 0 && !currentPlayer) {
            const message = updateFlags.chatMessages[0];
            updateMaskData.writeUnsignedShortBE(((message.color & 0xFF) << 8) + (message.effects & 0xFF));
            updateMaskData.writeByteInverted(player.attributes.getPrivilege());
            updateMaskData.writeOffsetByte(message.data.length);
            for(let i = 0; i < message.data.length; i++) {
                updateMaskData.writeOffsetByte(message.data.readInt8(i));
            }
        }

        if(updateFlags.faceMob !== undefined) {
            const mob = updateFlags.faceMob;

            if(mob === null) {
                // Reset faced mob
                updateMaskData.writeOffsetShortBE(65535);
            } else {
                let mobIndex = mob.worldIndex;

                if(mob instanceof Player) {
                    // Client checks if index is less than 32768.
                    // If it is, it looks for an NPC.
                    // If it isn't, it looks for a player (subtracting 32768 to find the index).
                    mobIndex += 32768 + 1;
                }

                updateMaskData.writeOffsetShortBE(mobIndex);
            }
        }

        if(updateFlags.facePosition || forceUpdate) {
            if(forceUpdate) {
                const position = player.position.fromDirection(player.getFaceDirection());
                updateMaskData.writeShortBE(position.getX() * 2 + 1);
                updateMaskData.writeShortBE(position.getY() * 2 + 1);
            } else {
                const position = updateFlags.facePosition;
                updateMaskData.writeShortBE(position.getX() * 2 + 1);
                updateMaskData.writeShortBE(position.getY() * 2 + 1);
            }
        }

        if(updateFlags.graphics) {
            const delay = updateFlags.graphics.delay || 0;
            updateMaskData.writeOffsetShortBE(updateFlags.graphics.id);
            updateMaskData.writeIntME1(updateFlags.graphics.height << 16 | delay & 0xffff);
        }

        if(updateFlags.appearanceUpdateRequired || forceUpdate) {
            // const equipment = player.equipment;
            const appearanceData: StreamBuffer = StreamBuffer.create();
            appearanceData.writeByte(player.attributes.appearance.gender); // Gender
            appearanceData.writeByte(-1); // Skull Icon
            appearanceData.writeByte(-1); // Prayer Icon

            const equipment = player.equipment;

            for(let i = 0; i < 4; i++) {
                const item = equipment.get(i);

                if(item) {
                    appearanceData.writeShortBE(0x200 + item.definition.id);
                } else {
                    appearanceData.writeByte(0);
                }
            }

            const torsoItem = equipment.get(EquipmentSlot.TORSO);
            if(torsoItem) {
                appearanceData.writeShortBE(0x200 + torsoItem.definition.id);
            } else {
                appearanceData.writeShortBE(0x100 + player.attributes.appearance.torso);
            }

            const offHandItem = equipment.get(EquipmentSlot.OFF_HAND);
            if(offHandItem) {
                appearanceData.writeShortBE(0x200 + offHandItem.definition.id);
            } else {
                appearanceData.writeByte(0);
            }

            // if(torsoItemData && torsoItemData.equipment && torsoItemData.equipment.torsoType && torsoItemData.equipment.torsoType === TorsoType.FULL) {
            //     appearanceData.writeShortBE(0x200 + torsoItem.itemId);
            // } else {
                appearanceData.writeShortBE(0x100 + player.attributes.appearance.arms);
            // }

            this.appendBasicAppearanceItem(appearanceData, equipment, player.attributes.appearance.legs, EquipmentSlot.LEGS);

            // const headItem = equipment.get(EquipmentSlot.HEAD);
            // let helmetType = null;
            // let fullHelmet = false;

            // if(headItem) {
            //     const headItemData = world.itemData.get(equipment.items[EquipmentSlot.HEAD].itemId);

            //     if(headItemData && headItemData.equipment && headItemData.equipment.helmetType) {
            //         helmetType = headItemData.equipment.helmetType;

            //         if(helmetType === HelmetType.FULL_HELMET) {
            //             fullHelmet = true;
            //         }
            //     }
            // }

            // if(!helmetType || helmetType === HelmetType.HAT) {
                appearanceData.writeShortBE(0x100 + player.attributes.appearance.head);
            // } else {
                // appearanceData.writeByte(0);
            // }

            this.appendBasicAppearanceItem(appearanceData, player.equipment, player.attributes.appearance.hands, EquipmentSlot.GLOVES);
            this.appendBasicAppearanceItem(appearanceData, player.equipment, player.attributes.appearance.feet, EquipmentSlot.BOOTS);

            // if(player.attributes.appearance.gender === 1 || fullHelmet) {
                // appearanceData.writeByte(0);
            // } else {
                appearanceData.writeShortBE(0x100 + player.attributes.appearance.facialHair);
            // }

            [
                player.attributes.appearance.hairColor,
                player.attributes.appearance.torsoColor,
                player.attributes.appearance.legColor,
                player.attributes.appearance.feetColor,
                player.attributes.appearance.skinColor,
            ].forEach(color => appearanceData.writeByte(color));

            [
                0x328, // stand
                0x337, // stand turn
                0x333, // walk
                0x334, // turn 180
                0x335, // turn 90
                0x336, // turn 90 reverse
                0x338, // run
            ].forEach(animationId => appearanceData.writeShortBE(animationId));

            appearanceData.writeLongBE(stringToLong(player.attributes.getUsername())); // Username
            appearanceData.writeByte(3); // Combat Level
            appearanceData.writeShortBE(0); // Skill Level (Total Level)

            const appearanceDataSize = appearanceData.getWriterIndex();

            updateMaskData.writeByte(appearanceDataSize);
            updateMaskData.writeBytes(appearanceData.getData().reverse());
        }
    }

    private appendBasicAppearanceItem(buffer: StreamBuffer, equipment: Inventory, appearanceInfo: number, equipmentSlot: EquipmentSlot): void {
        const item = equipment.get(equipmentSlot);
        if(item) {
            buffer.writeShortBE(0x200 + item.definition.id);
        } else {
            buffer.writeShortBE(0x100 + appearanceInfo);
        }
    }
}