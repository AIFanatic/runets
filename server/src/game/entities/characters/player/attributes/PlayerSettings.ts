export enum MouseButtons {
    ONE,
    TWO
}

export enum Brightness {
    DARK,
    NORMAL,
    BRIGHT,
    VERY_BRIGHT
}

export enum WidgetSettings {
    runMode = 173,
    musicVolume = 168,
    soundEffectVolume = 169,
    splitPrivateChat = 287,
    mouseButtons = 170,
    brightness = 166,
    chatEffects = 171,
    acceptAid = 427,
    autoRetaliate = 172,
    musicPlayer = 18,
    attackStyle = 43
};

export class PlayerSettings {
    public mouseButtons: MouseButtons = MouseButtons.TWO;
    public brightness: Brightness = Brightness.NORMAL;
    public chatEffects: boolean = true;
    public splitPrivateChat: boolean = false;
    public acceptAid: boolean = false;
    public runToggled: boolean = false;
    public autoRetaliate: boolean = true;
    public publicChatMode: number = 0;
    public privateChatMode: number = 0;
    public tradeMode: number = 0;
}