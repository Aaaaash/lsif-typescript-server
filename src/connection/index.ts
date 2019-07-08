import { logger } from 'src/logger';
import { WebSocketMessageReader } from './messageReader';
import { WebSocketMessageWriter } from './messageWriter';
import { Message, Event } from './protocol';

enum ConnectionState {
	New = 1,
	Listening = 2,
	Closed = 3,
	Disposed = 4
}

export class Connection {

  public state: ConnectionState = ConnectionState.New;

  constructor(
    private messageReader: WebSocketMessageReader,
    private messageWriter: WebSocketMessageWriter,
  ) {}

  public listen() {
    logger.log('Start listen connection.');
    this.state = ConnectionState.Listening;
    this.messageReader.listen(this.messageCallback);
  }

  private messageCallback(message: Message<any>) {
    logger.debug(`[DEBUG]: Receive ${message.type}, method ${message.method}, arguments ${JSON.stringify(message.arguments)} `);
    if (message.type === Event.Request) {
      //
    } else if (message.type === Event.Notification) {
      //
    }
  }

  public onRequest() {

  }

  public onNotification() {

  }

  public sendRequest() {

  }

  public sendNotification() {

  }

  public  dispose() {

  }
}

export {
  WebSocketMessageReader,
  WebSocketMessageWriter
}

