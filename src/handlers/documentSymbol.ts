import { jsonDatabase } from 'src/dataBase';
import { DocumentSymbolRequest } from 'src/connection/protocol';
import logger from 'src/logger';
import { lsp } from 'lsif-protocol';

export function documentSymbol(args: DocumentSymbolRequest): lsp.DocumentSymbol[] | undefined {
    const { arguments: { textDocument } } = args;
    logger.log(textDocument.uri);
    const documentSymbol = jsonDatabase.documentSymbols(textDocument.uri);
    return documentSymbol;
}
