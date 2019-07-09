import ws from 'ws';

export interface MessageWriter {
    write(msg: ResponseMessage | RequestMessage): void;
    dispose(): void;
}

export interface RequestMessage {
    id: number;
    method: string;
    params: any;
}

export interface ResponseMessage {
    id: number;
    method: string;
    result: any;
}

export class WebSocketMessageWriter implements MessageWriter {

    constructor(private socket: ws) {}

    public write(message: ResponseMessage | RequestMessage): void {
        const jsonData = JSON.stringify(message);
        this.socket.send(jsonData);
    }

    public dispose() {}
}
