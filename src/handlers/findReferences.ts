import { FindReferencesRequest } from 'src/connection/protocol';
import { lsp } from 'lsif-protocol';
import { withDB } from 'src/dbCache';

export async function findReferences(
    args: FindReferencesRequest,
): Promise<lsp.Location[] | undefined> {
    const { arguments: { textDocument, position, repository, commit } } = args;
    const context = {
        includeDeclaration: true,
    };
    const database = await withDB(repository, commit);
    const references = database.references(textDocument.uri, position, context);
    return references;
}
