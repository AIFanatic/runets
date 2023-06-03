import { DataService } from "@runeserver-ts/service/DataService";
import { Item } from "@runeserver-ts/game/Item";

export enum EquipmentSlot {
    HEAD = 0,
    BACK = 1,
    NECK = 2,
    MAIN_HAND = 3,
    TORSO = 4,
    OFF_HAND = 5,
    LEGS = 7,
    GLOVES = 9,
    BOOTS = 10,
    RING = 12,
    QUIVER = 13
}

export enum InventoryWidgetIds {
    INVENTORY = 3214,
    EQUIPMENT = 1688
};

export enum InventoryConstants {

	/**
	 * The capacity of the bank.
	 */
	BANK_CAPACITY = 352,

	/**
	 * The capacity of the equipment inventory.
	 */
	EQUIPMENT_CAPACITY = 14,

	/**
	 * The capacity of the inventory.
	 */
	INVENTORY_CAPACITY = 28,
}

export class Inventory {
    private capacity: number;
    private items: Array<Item>;
    private size: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.items = new Array<Item>(this.capacity).fill(null);
        this.size = 0;
    }

    // TODO: Check stackable etc
    // Adds to empty slot
    public add(item: Item) {
        if (this.size >= this.capacity) {
            console.log("This inventory is full.");
            return;
        }
        
        const emptySlot = this.getEmptySlot();
        this.items[emptySlot] = item;
        this.size++;
    }

    public addById(id: number, amount: number = 1) {
        const itemDefinition = DataService.getInstance().items.get(id);
        if (!itemDefinition) {
            console.log(`Item with id ${id} not found`);
            return;
        }

        const item = new Item(itemDefinition);
        item.amount = amount;
        this.add(item);
    }

    public set(item: Item, slot: number) {
        if (slot >= this.capacity) {
            console.log("Slot can't be bigger than capacity.");
            return;
        }

        if (this.items[slot] !== null) {
            console.log("Slot not empty");
            return;
        }
        
        this.items[slot] = item;
        this.size++;
    }

    public remove(slot: number) {
        if (slot > this.capacity) {
            console.log("Tried to get an item that has a slot bigger than inventory capacity.");
            return;
        }

        this.items[slot] = null;
        this.size--;
    }

    public getItems(): Item[] {
        return this.items;
    }

    public get(slot: number): Item {
        if (slot > this.capacity) {
            console.log("Tried to get an item that has a slot bigger than inventory capacity.");
            return;
        }

        return this.items[slot];
    }

    public slotOf(item: Item): number {
        if (item === null) {
            console.log("Invalid item.");
            return;
        }

        for (let i = 0; i < this.items.length; i++) {
            if (item === this.items[i]) return i;
        }

        return -1;
    }

    public getEmptySlot(): number {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] === null) return i;
        }
        return -1;
    }

    public swap(from: number, to: number) {
        if (from > this.capacity) {
            console.log(`Swap "from" or "to" bigger than capacity`);
            return;
        }

        // By reference probably doesnt work
        const tempFrom = this.items[from];

        this.items[from] = this.items[to];
        this.items[to] = tempFrom;
    }

    public getSize(): number {
        return this.size;
    }
}