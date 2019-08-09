import * as path from 'path';
import * as fse from 'fs-extra';
import ws from 'ws';
import express, { Request, Response } from 'express';
import { lsp } from 'lsif-protocol';

import { logger } from './logger';
import { Connection, WebSocketMessageReader, WebSocketMessageWriter } from './connection';
import { InitializeRequest, DocumentSymbolRequest, FindReferencesRequest, GotoDefinitionRequest, HoverRequest } from './connection/protocol';
import { documentSymbol, initialize, findReferences, gotoDefinition, hover } from './handlers';
import { checkCommit, checkRepository } from './utils';
import { DB_STORAGE_PATH } from './constants';

const app = express();

const server = app.listen(8088, () => {
    logger.log('Start server in 8088 port.');
});

app.post('/upload', (req: Request, res: Response) => {
    const { commit, repository } = req.query;

    checkCommit(commit);
    checkRepository(repository);

    const dumpFilePath = path.join(DB_STORAGE_PATH, `${repository}@${commit}.lsif`);
    const dumpFileWriteStream = fse.createWriteStream(dumpFilePath);

    req.pipe(dumpFileWriteStream);

    dumpFileWriteStream.on('close', () => {
        res.send('Upload successful.');
    });
    dumpFileWriteStream.on('error', (err) => {
        res.send(`Upload error, ${err.message}`);
    });
});

const wss = new ws.Server({
    server,
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

wss.on('connection', (websocket: ws) => {
    const messageReader = new WebSocketMessageReader(websocket);
    const messageWriter = new WebSocketMessageWriter(websocket);
    const connection = new Connection(messageReader, messageWriter);

    connection.listen();

    connection.onRequest<InitializeRequest, { initialized: true } | { initialized: false; message: string }>('initialize', initialize);

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
