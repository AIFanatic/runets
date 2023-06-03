import { WebSocketServer, WebSocket } from 'ws';

const net = require("net");

import { Service } from "@runeserver-ts/service/Service";;
import { Server } from "@runeserver-ts/Server";;
import { Client } from "@runeserver-ts/game/client/Client";;
import { uuidv4 } from "@runeserver-ts/util/uuidv4";;

export class NetworkService implements Service {
    private static instance: NetworkService;

    private serverChannel: WebSocketServer;
    private clientMap: Map<string, Client>;

    private constructor() {
    }

    public init() {
        this.clientMap = new Map();
        
        console.log("Started NetworkService service.");

        this.serverChannel = new WebSocketServer({
            host: Server.getInstance().getSettings().serverHost,
            port: Server.getInstance().getSettings().serverPort
        });

        this.serverChannel.on("connection", clientSocket => {
            this.accept(clientSocket);
        });




        // var server = net.createServer(connection => { 
        //     console.log('client connected');
            
        //     // connection.on('end', function() {
        //     //     console.log('client disconnected');
        //     // });
            
        //     connection.write('Hello World!\r\n');
        //     connection.pipe(connection);

        //     this.acceptNet(connection);
        // });
        
        // server.listen(Server.getInstance().getSettings().serverPort, Server.getInstance().getSettings().serverHost, () => { 
        //     console.log('server is listening');
        // });
    }
    private acceptNet(socket: net.Socket) {
        const key = uuidv4();
        const client = new Client(socket);

        console.log("Accepted new Client");
        this.clientMap.set(key, client);
    }

    private accept(socket: WebSocket) {
        const key = uuidv4();
        const client = new Client(socket);

        console.log("Accepted new Client");
        this.clientMap.set(key, client);
    }

    public tick() {
    }

    public cleanup() {
    }

    public static getInstance(): NetworkService {
        if (!NetworkService.instance) {
            NetworkService.instance = new NetworkService();
        }
        return NetworkService.instance;
    }
}