export interface Service {
    init();
    tick();
    cleanup();
}