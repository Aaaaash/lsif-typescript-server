import { FindReferencesRequest } from 'src/connection/protocol';
import { jsonDatabase } from 'src/dataBase';
import { lsp } from 'lsif-protocol';

export function findReferences(args: FindReferencesRequest): lsp.Location[] | undefined {
    const { arguments: { textDocument, position } } = args;
    const context = {
        includeDeclaration: true,
    };
    const references = jsonDatabase.references(textDocument.uri, position, context);
    return references;
}
