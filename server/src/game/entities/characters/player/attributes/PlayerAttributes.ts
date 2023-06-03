import { Misc } from "@runeserver-ts/util/Misc";
import { PlayerPrivilege } from "@runeserver-ts/game/entities/characters/player/Player";
import { PlayerBonuses } from "@runeserver-ts/game/entities/characters/player/attributes/PlayerBonuses";
import { PlayerSettings } from "@runeserver-ts/game/entities/characters/player/attributes/PlayerSettings";

interface Appearance {
    gender: number;
    head: number;
    torso: number;
    arms: number;
    legs: number;
    hands: number;
    feet: number;
    facialHair: number;
    hairColor: number;
    torsoColor: number;
    legColor: number;
    feetColor: number;
    skinColor: number;
}

const defaultAppearance = (): Appearance => {
    return {
        gender: 0,
        head: 0,
        torso: 10,
        arms: 26,
        legs: 36,
        hands: 33,
        feet: 42,
        facialHair: 18,
        hairColor: 0,
        torsoColor: 0,
        legColor: 0,
        feetColor: 0,
        skinColor: 0
    } as Appearance;
};

export class PlayerAttributes {
    private userId: number;
    private username: string;
    private password: string;

    private privilege: PlayerPrivilege;
    private settings: PlayerSettings = new PlayerSettings();

    private gender: number = Misc.GENDER_MALE;
    private runEnergy: number = 100;
    public appearance: Appearance = defaultAppearance();
    private colors: number[] = [];
    
    private bonuses: PlayerBonuses;

    constructor() {
        this.privilege = PlayerPrivilege.REGULAR;

        // Set the default colors.
        this.colors[0] = 7;
        this.colors[1] = 8;
        this.colors[2] = 9;
        this.colors[3] = 5;
        this.colors[4] = 0;

        this.bonuses = new PlayerBonuses();
    }

    public getPrivilege(): PlayerPrivilege {
        return this.privilege;
    }

    public setPrivilege(privilege: PlayerPrivilege) {
        this.privilege = privilege;
    }

    public getUserId(): number {
        return this.userId;
    }

    public setUserId(userId: number) {
        this.userId = userId;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string) {
        this.username = username;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string) {
        this.password = password;
    }

    public getRunEnergy(): number {
        return this.runEnergy;
    }

    public setRunEnergy(runEnergy: number) {
        this.runEnergy = runEnergy;
    }

    public hasRunEnergy(): boolean {
        return this.runEnergy > 0;
    }

    public decreaseRunEnergy(amount: number) {
        this.runEnergy = Math.max(0, this.runEnergy - amount);
    }

    public increaseRunEnergy(amount: number) {
        this.runEnergy = Math.min(100, this.runEnergy + amount);
    }

    public getSettings(): PlayerSettings {
        return this.settings;
    }

    public getBonuses(): PlayerBonuses {
        return this.bonuses;
    }
}