import ws from 'ws';

import { Message } from './protocol';

export interface DataCallback {
	(data: Message): void;
}

export interface MessageReader {
	listen(callback: DataCallback): void;
	dispose(): void;
}

export class WebSocketMessageReader implements MessageReader {

  constructor(private socket: ws) {}

  public listen(messageCallBack: (message: Message) => void) {
    this.socket.addEventListener('message', (event) => {
      const { data } = event;
      //
    });
  }

  public dispose() {}
}
