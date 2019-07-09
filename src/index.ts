import ws from "ws";

import { logger } from './logger';
import { Connection, WebSocketMessageReader, WebSocketMessageWriter } from './connection';
import { InitializeRequest } from './connection/protocol';

const wss = new ws.Server({
    port: 8088,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024,
    }
});

wss.addListener("listening", () => {
    logger.log("Start websocket server in 8088.");
});

wss.on("connection", (websocket: ws) => {
    const messageReader = new WebSocketMessageReader(websocket);
    const messageWriter = new WebSocketMessageWriter(websocket);
    const connection = new Connection(messageReader, messageWriter);

    connection.listen();

    connection.onRequest<{}, InitializeRequest>('initialize', (message) => {
        const { arguments: { projectName, gitRepoUrl } } = message;
        logger.log(`[Initialize] - initalize project ${projectName}.`);
    });
});
