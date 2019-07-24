import { logger } from 'src/logger';
import { WebSocketMessageReader } from './messageReader';
import { WebSocketMessageWriter } from './messageWriter';
import { Message, Event } from './protocol';
import { LinkedMap } from './linkedMap';

enum ConnectionState {
    New = 1,
    Listening = 2,
    Closed = 3,
    Disposed = 4
}

interface ResponsePromise {
    method: string;
    timerStart: number;
    resolve: (response: any) => void;
    reject: (error: any) => void;
}


export type HandlerResult<R> = R | Promise<R>;

export interface GenericRequestHandler<R> {
    (...params: any[]): R | Promise<R>;
}

export class Connection {

    public state: ConnectionState = ConnectionState.New;

    private responsePromises: { [method: string]: ResponsePromise } = Object.create(null);

    private sequenceNumber: number = 0;

    private messageQueue: LinkedMap<string, Message<any>> = new LinkedMap();

    private requestHandlers: Map<string, GenericRequestHandler<any>> = new Map();

    private notificationHandlers: Map<string, (args: any) => void> = new Map();

    constructor(
        private messageReader: WebSocketMessageReader,
        private messageWriter: WebSocketMessageWriter,
    ) { }

    public listen(): void {
        logger.log('Connection success.');
        this.state = ConnectionState.Listening;
        this.messageReader.listen(this.messageCallback);
    }

    private messageCallback = (message: Message<any>) => {
        logger.debug(`[DEBUG]: Receive ${message.type}, method ${message.method}, arguments ${JSON.stringify(message.arguments)} `);
        if (message.type === Event.Request) {
            //
        } else if (message.type === Event.Notification) {
            //
        }

        this.addMessageToQueue(message);

        this.triggerMessageQueue();
    }

    private addMessageToQueue = (message: Message<any>) => {
        if (message.type === Event.Response) {
            this.messageQueue.set(`res-${String(message.id)}`, message);
        } else if (message.type === Event.Request) {
            this.messageQueue.set(`req-${String(message.id)}`, message);
        } else {
            this.messageQueue.set(`not-${String(message.id)}`, message);
        }
    }

    private triggerMessageQueue(): void {
        if (this.messageQueue.size === 0) {
            return;
        }

        const message = this.messageQueue.shift();

        if (message) {
            if (message.type === Event.Request) {
                this.handleRequest(message);
            } else if (message.type === Event.Response) {
                this.handleResponse(message);
            } else {
                this.handleNotification(message);
            }
        }
    }

    private handleRequest(message: Message<any>): void {
        const requestHandler = this.requestHandlers.get(message.method!);
        if (requestHandler) {
            const result = requestHandler(message);
            if (result) {
                if (result.then) {
                    result.then((data: any) => {
                        const responseMessage = {
                            id: message.id,
                            method: message.method!,
                            result: data,
                        };
                        this.messageWriter.write(responseMessage);
                    });
                } else {
                    const responseMessage = {
                        result,
                        id: message.id,
                        method: message.method!,
                    };

                    this.messageWriter.write(responseMessage);
                }
            } else {
                const responseMessage = {
                    result: null,
                    id: message.id,
                    method: message.method!,
                };
                this.messageWriter.write(responseMessage);
            }
        }
    }

    private handleResponse(message: Message<any>): void {

    }

    private handleNotification(message: Message<any>): void {

    }

    public onRequest<T, R>(method: string, handler: (args: T) => Promise<R>): void {
        this.requestHandlers.set(method, handler);
    }

    public onNotification<T, R>(notifyType: string, handler: (args: R) => void): void {
        this.notificationHandlers.set(notifyType, handler);
    }

    public sendRequest<R>(method: string, ...params: any[]): Promise<any> {
        this.sequenceNumber += 1;
        const id = this.sequenceNumber += 1;
        return new Promise<R>((resolve, reject) => {
            this.responsePromises[String(id)] = {
                resolve,
                reject,
                method,
                timerStart: Date.now(),
            };

            const requestMessage = {
                id,
                params,
                method,
            }
            this.messageWriter.write(requestMessage);
        });
    }

    public sendNotification(): void {

    }

    public dispose(): void {

    }
}

export {
    WebSocketMessageReader,
    WebSocketMessageWriter
}

