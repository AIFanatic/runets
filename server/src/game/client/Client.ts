import { WebSocket } from 'ws';

import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { ISAACCipher } from "@runeserver-ts/net/ISAACCipher";
import { Packet } from "@runeserver-ts/net/Packet";
import { ClientHandshake } from "@runeserver-ts/game/client/ClientHandshake";;
import { ClientLoginRequest } from "@runeserver-ts/game/client/ClientLoginRequest";;
import { ClientLoginResponse, ClientPrivilege, LoginResponse } from "@runeserver-ts/game/client/ClientLoginResponse";;
import { GameService } from "@runeserver-ts/service/GameService";;

export enum ConnectionStage {
    CONNECTED,
    LOGGING_IN,
    LOGGED_IN,
    LOGGED_OUT
}
export class Client {
    private socketChannel: WebSocket;
    private connectionStage: ConnectionStage;

    private encryptor: ISAACCipher;
    private decryptor: ISAACCipher;

    public onDataReceivedCallback: (buffer: StreamBuffer) => void;
    public onDisconnected: () => void;

    constructor(socket: WebSocket) {
        this.socketChannel = socket;

        this.setConnectionStage(ConnectionStage.CONNECTED);

        // // Net
        // this.socketChannel.on('data', data => {
        //     console.log("data", data)
        //     this.handleIncomingData(data as Buffer);
        // });

        // Socket
        this.socketChannel.on("message", data => {
            this.handleIncomingData(data as Buffer);
        });

        this.socketChannel.on("close", data => {
            console.log("CLOSED CLIENT");
            if (this.onDisconnected) {
                this.onDisconnected();
            }
        });
    }

    /**
     * Disconnects the client.
     */
     public disconnect() {
        console.log(this + " disconnecting.");

        try {
            this.socketChannel.close();
        } catch (error) {
            console.error(error);
        } 
    }

    /**
     * Handles a received packet.
     */
    public handleIncomingData(data: Buffer) {
        try {
            const inData = new StreamBuffer(data);

            while (inData.getReaderIndex() != inData.getBuffer().length) {
                if (this.getConnectionStage() != ConnectionStage.LOGGED_IN) {
                    this.handleLogin(inData);
                    break;
                }

                if (this.onDataReceivedCallback) {
                    this.onDataReceivedCallback(inData);
                }
            }
        }
        catch(error) {
            console.error(error);
        }
    }
    
    /**
     * Encrypts and sends the packet to the socket.
     *
     * @param packet the packet
     */
    public send(packet: Packet) {
        try {
            this.socketChannel.send(packet.toBuffer(this.getEncryptor()));
        } catch (error) {
            console.error(error);
            this.disconnect();
        }
    }

    /**
     * Handles the login process of the client.
     */
     private handleLogin(inData: StreamBuffer) {
        // timeoutStopwatch.reset();

        const connectionStage = this.getConnectionStage();
        
        if (connectionStage == ConnectionStage.CONNECTED) {
            const handshakeSuccessful = ClientHandshake.Parse(this, inData);

            if (handshakeSuccessful) {
                this.setConnectionStage(ConnectionStage.LOGGING_IN);
            }
        }
        else if (connectionStage == ConnectionStage.LOGGING_IN) {
            const loginResponse = ClientLoginRequest.Parse(this, inData);

            if (loginResponse.status) {
                const response = LoginResponse.LOGIN_RESPONSE_OK;
        
                console.log("TODO: Validate player credentials, save, load etc.");
        
                // // Check if the player is already logged in.
                // if (WorldHandler.getInstance().isPlayerOnline(username)) {
                //     response = Misc.LOGIN_RESPONSE_ACCOUNT_ONLINE;
                // }
        
                // // Load the player and send the login response.
                // PlayerAttributes attributes;
                // boolean validPassword = true;
                // boolean newPlayer = false;
        
                // try {
                //     attributes = server.getPlayerFileHandler().load(this.attributes.getUsername());
                //     validPassword = attributes.getPassword().equals(getAttributes().getPassword());
                //     this.attributes = attributes;
                // } catch (NoSuchFileException e) {
                //     newPlayer = true;
                // } catch (Exception e) {
                //     response = Misc.LOGIN_RESPONSE_PLEASE_TRY_AGAIN;
                // }
                // boolean validCredentials = server.getCredentialValidator().validate(this.attributes.getUsername(), password);
        
                // // Invalid username/password - we skip the check if the account is found because the validation may have changed since
                // if ((newPlayer && !validCredentials) || !validPassword) {
                //     response = Misc.LOGIN_RESPONSE_INVALID_CREDENTIALS;
                //     ConnectionThrottle.enter(getHost());
                // }
        
                // // Check if banned
                // if (this.attributes.getInfractions().isBanned()) {
                //     response = Misc.LOGIN_RESPONSE_ACCOUNT_DISABLED;
                // }
        
                // // Check if connection limit is exceeded
                // if (HostGateway.count(getHost()) >= settings.getMaxConsPerHost() + 1) {
                //     response = Misc.LOGIN_RESPONSE_LOGIN_LIMIT_EXCEEDED;
                // }
        
                // // Check if login attempts exceeded
                // if (ConnectionThrottle.throttled(getHost())) {
                //     response = Misc.LOGIN_RESPONSE_LOGIN_ATTEMPTS_EXCEEDED;
                // }

                if (response != LoginResponse.LOGIN_RESPONSE_OK) {
                    this.disconnect();
                    return;
                }

                const PRIVILEGE = ClientPrivilege.REGULAR;

                const result = ClientLoginResponse.Send(this, response, PRIVILEGE);

                if (result) {
                    GameService.getInstance().createPlayer(this, loginResponse.userId, loginResponse.username, loginResponse.password);

                    this.setConnectionStage(ConnectionStage.LOGGED_IN);
                }
            }
        }
    }

    /**
     * Gets the encryptor.
     */
    public getEncryptor(): ISAACCipher {
        return this.encryptor;
    }

    /**
     * Sets the encryptor.
     */
    public setEncryptor(encryptor: ISAACCipher) {
        this.encryptor = encryptor;
    }

    /**
     * Gets the decryptor.
     */
    public getDecryptor(): ISAACCipher {
        return this.decryptor;
    }

    /**
     * Sets the decryptor.
     */
    public setDecryptor(decryptor: ISAACCipher) {
        this.decryptor = decryptor;
    }

    
    public getSocketChannel(): WebSocket {
        return this.socketChannel;
    }

    /**
     * Gets the {@link ConnectionStage}.
     */
    private getConnectionStage(): ConnectionStage {
        return this.connectionStage;
    }

    /**
     * Sets the {@link ConnectionStage}.
     */
    private setConnectionStage(connectionStage: ConnectionStage) {
        console.log("Changed connection stage to", connectionStage.valueOf());
        this.connectionStage = connectionStage;
    }
}