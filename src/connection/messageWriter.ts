import ws from 'ws';

import { Message } from './protocol';

export class MessageWriter {

  constructor(private socket: ws) {}

  public write(message: Message) {
    const jsonData = JSON.stringify(message);
    this.socket.send(jsonData);
  }
}
