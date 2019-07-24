import { DocumentSymbolRequest } from 'src/connection/protocol';
import { lsp } from 'lsif-protocol';
import { withDB } from 'src/dbCache';

export async function documentSymbol(
    args: DocumentSymbolRequest,
): Promise<lsp.DocumentSymbol[] | undefined> {
    const { arguments: { textDocument, repository, commit } } = args;
    const database = await withDB(repository, commit);
    const documentSymbol = database.documentSymbols(textDocument.uri);
    return documentSymbol;
}
