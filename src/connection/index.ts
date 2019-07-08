import { MessageReader } from './messageReader';
import { MessageWriter } from './messageWriter';
import { Message } from './protocol';

enum ConnectionState {
	New = 1,
	Listening = 2,
	Closed = 3,
	Disposed = 4
}

export class Connection {

  public state: ConnectionState = ConnectionState.New;

  constructor(
    private messageReader: MessageReader,
    private messageWriter: MessageWriter,
  ) {}

  public listen() {
    this.state = ConnectionState.Listening;
    this.messageReader.listen(this.messageCallback);
  }

  private messageCallback(message: Message) {

    // this.messageWriter.write(message);
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
  MessageReader,
  MessageWriter
}

