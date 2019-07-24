import { GotoDefinitionRequest } from 'src/connection/protocol';
import { lsp } from 'lsif-protocol';
import { withDB } from 'src/dbCache';

export async function gotoDefinition(
    args: GotoDefinitionRequest,
): Promise<lsp.Location[] | undefined> {
    const { arguments: { textDocument, position, repository, commit } } = args;
    const database = await withDB(repository, commit);
    const definition = database.gotoDefinition(textDocument.uri, position);
    return definition;
}
