export interface Tickable {
    // Main update
    update();

    // Called after all updates are done
    lateUpdate();
}