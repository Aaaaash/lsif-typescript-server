import ws from 'ws';

import { Message } from './protocol';
import { logger } from 'src/logger';

export interface DataCallback {
	(data: any): void;
}

export interface MessageReader {
	listen(callback: DataCallback): void;
	dispose(): void;
}

export class WebSocketMessageReader implements MessageReader {

  constructor(private socket: ws) {}

  public listen(messageCallBack: (message: any) => void) {
    this.socket.addEventListener('message', (event) => {
      const { data } = event;
      logger.debug(`[DEBUG]: Receive message ${data}`);
      try {
        const rpcMessage = JSON.parse(data);
        messageCallBack(rpcMessage);
      } catch(err) {
        logger.error(`[ERROR]: ${err}`);
      }
    });
  }

  public dispose() {}
}
