import { Service } from "./service/Service";

export interface ServerSettings {
    serverName: string;
    serverPort: number;
    serverHost: string;
    tickRate: number;
    rsaModulus: string;
    rsaExponent: string;
    serverKey: string;
};

export class Server implements Service {
    private static instance: Server;
    private readonly settings: ServerSettings;
    private services: Service[];

    constructor(settings: ServerSettings, services: Service[]) {
        this.settings = settings;
        this.services = services;

        Server.setInstance(this);

        this.init();
        setInterval(() => {
            this.tick();
        }, this.settings.tickRate);

        // do app specific cleaning before exiting
        process.on('exit', () => {
            console.log("Process exit.");
        });

        // catch ctrl+c event and exit normally
        process.on('SIGINT', () => {
            this.cleanup();
            setTimeout(() => {
                process.exit(2);
            }, 1000);
        });
    }

    /**
     * Initialises the server.
     */
    public init() {
        console.log("Started Server.");
        for (const service of this.services) {
            service.init();
        }
    }

    /**
     * Performs a server tick.
     */
    public tick() {
        for (const service of this.services) {
            service.tick();
        }
    }

    public getSettings(): ServerSettings {
        return this.settings;
    }

    /**
     * Cleans up the server.
     */
    public cleanup() {
        for (const service of this.services) {
            service.cleanup();
        }
    }

    /**
     * Gets the server instance.
     */
     public static getInstance(): Server {
        return this.instance;
    }

    /**
     * Sets the server instance.
     */
    public static setInstance(instance: Server) {
        if (Server.instance != null) {
            throw new Error("Singleton already set!");
        }
        Server.instance = instance;
    }
}