import ws from 'ws';

import { logger } from './logger';
import { Connection, WebSocketMessageReader, WebSocketMessageWriter } from './connection';
import { InitializeRequest, DocumentSymbolRequest, FindReferencesRequest, GotoDefinitionRequest, HoverRequest } from './connection/protocol';
import { documentSymbol, initialize, findReferences, gotoDefinition, hover } from './handlers';
import { lsp } from 'lsif-protocol';

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

wss.addListener('listening', () => {
    logger.log('Start websocket server in 8088.');
});

wss.on('connection', (websocket: ws) => {
    const messageReader = new WebSocketMessageReader(websocket);
    const messageWriter = new WebSocketMessageWriter(websocket);
    const connection = new Connection(messageReader, messageWriter);

    connection.listen();

    connection.onRequest<InitializeRequest, Promise<{ initialized: true } | { initialized: false; message: string }>>('initialize', initialize);

    connection.onRequest<DocumentSymbolRequest, lsp.DocumentSymbol[] | undefined>('documentSymbol', documentSymbol);

    connection.onRequest<FindReferencesRequest, lsp.Location[] | undefined>('findReferences', findReferences);

    connection.onRequest<GotoDefinitionRequest, lsp.Location[] | undefined>('gotoDefinition', gotoDefinition);

    connection.onRequest<HoverRequest, lsp.Hover | undefined>('hover', hover);
});

process.on('unhandledRejection', (reason) => {
    logger.error(`Receive unhandled Rejection, ${reason}`);
});

process.on('uncaughtException', (err) => {
    logger.error(`Receive uncaught Exception, ${err.message}`);
});
