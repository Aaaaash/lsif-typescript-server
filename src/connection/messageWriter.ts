import ws from 'ws';

import { Message } from './protocol';

export interface MessageWriter {
	write<T>(msg: Message<T>): void;
	dispose(): void;
}

export class WebSocketMessageWriter implements MessageWriter {

  constructor(private socket: ws) {}

  public write<T>(message: Message<T>) {
    const jsonData = JSON.stringify(message);
    this.socket.send(jsonData);
  }

  public dispose() {}
}
