import { HoverRequest } from 'src/connection/protocol';
import { withDB } from 'src/dbCache';
import { lsp } from 'lsif-protocol';

export async function hover(
    args: HoverRequest,
): Promise<lsp.Hover | undefined> {
    const { arguments: { textDocument, position, repository, commit } } = args;
    const database = await withDB(repository, commit);
    const hoverResults = database.hover(textDocument.uri, position);
    return hoverResults;
}
