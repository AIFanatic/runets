import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Player } from "@runeserver-ts/game/entities/characters/player/Player";

enum ButtonId {
    WALK = 152,
    RUN = 153,
    
    // MUSIC_VOLUME

    // SOUND_EFFECT_VOLUME
    
    SPLIT_PRIVATE_CHAT_ON = 957,
    SPLIT_PRIVATE_CHAT_OFF = 958,
    
    MOUSE_BUTTONS_1 = 913,
    MOUSE_BUTTON_2 = 914,
    
    // SCREEN_BRIGHTNESS
    
    CHAT_EFFECTS_ON = 915,
    CHAT_EFFECTS_OFF = 916,
    
    ACCEPT_AID_ON = 12464,
    ACCEPT_AID_OFF = 12465,

    AUTO_RETALIATE_ON = 150,
    AUTO_RETALIATE_OFF = 151

    // 152, 153, // walk/run
    // 930, 931, 932, 933, 934, // music volume
    // 941, 942, 943, 944, 945, // sound effect volume
    // 957, 958, // split private chat
    // 913, 914, // mouse buttons
    // 906, 908, 910, 912, // screen brightness
    // 915, 916, // chat effects
    // 12464, 12465, // accept aid
    // 150, 151, // auto retaliate
};

export class ButtonAction {
    private static ParseRequest(packetId: number, packetSize: number, buffer: StreamBuffer): ButtonId {
        return buffer.readShortBE();
    }

    public static Process(player: Player, packetId: number, packetSize: number, buffer: StreamBuffer) {
        const buttonId = ButtonAction.ParseRequest(packetId, packetSize, buffer);

        if (buttonId == ButtonId.WALK) {
            player.attributes.getSettings().runToggled = false;
        }
        else if (buttonId == ButtonId.RUN) {
            player.attributes.getSettings().runToggled = true;
        }
        else {
            console.log(`Button ${buttonId} not implemented`)
        }
    }
}