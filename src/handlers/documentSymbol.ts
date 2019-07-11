import { jsonDatabase } from 'src/dataBase';
import { DocumentSymbolRequest } from 'src/connection/protocol';

export function documentSymbol(args: DocumentSymbolRequest): string {
    console.log(args);
    console.log(jsonDatabase.getDocumentInfos());
    return '';
}
