import { jsonDatabase } from 'src/dataBase';
import { DocumentSymbolRequest } from 'src/connection/protocol';

export function documentSymbol(args: DocumentSymbolRequest): string {
    const { arguments: { textDocument } } = args;
    const documentSymbol = jsonDatabase.documentSymbols(textDocument.uri);
    console.log(JSON.stringify(documentSymbol));
    return JSON.stringify(documentSymbol);
}
