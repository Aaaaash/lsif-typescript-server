import { jsonDatabase } from 'src/dataBase';
import { DocumentSymbolRequest } from 'src/connection/protocol';
import logger from 'src/logger';

export function documentSymbol(args: DocumentSymbolRequest): string {
    const { arguments: { textDocument } } = args;
    logger.log(textDocument.uri);
    const documentSymbol = jsonDatabase.documentSymbols(textDocument.uri);
    console.log(JSON.stringify(documentSymbol));
    return JSON.stringify(documentSymbol);
}
