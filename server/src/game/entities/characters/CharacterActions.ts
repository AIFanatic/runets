import { Deque } from "@runeserver-ts/util/Deque";
import { Tickable } from "@runeserver-ts/util/Tickable";

export interface CharacterAction {
    run: () => Promise<boolean>;
}

export class CharacterActions implements Tickable {
    private actions: Deque<CharacterAction>;
    private pendingActionExecution: boolean;
    
    constructor() {
    this.actions = new Deque();
        this.pendingActionExecution = false;
    }

    public update() {
        if (this.actions.size == 0) return;
        if (this.pendingActionExecution) return;

        if (!this.pendingActionExecution) {
            this.pendingActionExecution = true;
            const action = this.actions.poll();

            action.run().then(done => {
                if (done) {
                    this.pendingActionExecution = false;
                }
            })
        }
    }

    public lateUpdate() {
    }

    public add(action: CharacterAction) {
        this.actions.add(action);
    }
}