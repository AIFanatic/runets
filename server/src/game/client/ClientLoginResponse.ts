import { StreamBuffer } from "@runeserver-ts/net/StreamBuffer";
import { Client } from "@runeserver-ts/game/client/Client";

export enum LoginResponse {
    LOGIN_RESPONSE_OK = 2,
    LOGIN_RESPONSE_INVALID_CREDENTIALS = 3,
    LOGIN_RESPONSE_ACCOUNT_DISABLED = 4,
    LOGIN_RESPONSE_ACCOUNT_ONLINE = 5,
    LOGIN_RESPONSE_UPDATED = 6,
    LOGIN_RESPONSE_WORLD_FULL = 7,
    LOGIN_RESPONSE_LOGIN_SERVER_OFFLINE = 8,
    LOGIN_RESPONSE_LOGIN_LIMIT_EXCEEDED = 9,
    LOGIN_RESPONSE_BAD_SESSION_ID = 10,
    LOGIN_RESPONSE_PLEASE_TRY_AGAIN = 11,
    LOGIN_RESPONSE_NEED_MEMBERS = 12,
    LOGIN_RESPONSE_COULD_NOT_COMPLETE_LOGIN = 13,
    LOGIN_RESPONSE_SERVER_BEING_UPDATED = 14,
    LOGIN_RESPONSE_LOGIN_ATTEMPTS_EXCEEDED = 16,
    LOGIN_RESPONSE_MEMBERS_ONLY_AREA = 17,
}

export enum ClientPrivilege {
    REGULAR,
    MODERATOR,
    ADMINISTRATOR
}

export interface ClientLoginResponseResponse {
    status: boolean;
}

export class ClientLoginResponse {
    public static Send(client: Client, response: LoginResponse, privilege: ClientPrivilege): ClientLoginResponseResponse {
        // Sending response
        const resp: StreamBuffer = StreamBuffer.create(3);
        resp.writeByte(response);
        resp.writeByte(privilege);
        resp.writeByte(0);
        client.getSocketChannel().send(resp.getData());

        return {
            status: true,
        };
    }
}