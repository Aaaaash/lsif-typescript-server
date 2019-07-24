import { HoverRequest } from 'src/connection/protocol';
import { jsonDatabase } from 'src/jsonDatabase';
import { lsp } from 'lsif-protocol';

export function hover(args: HoverRequest): lsp.Hover | undefined {
    const { arguments: { textDocument, position } } = args;
    const hoverResults = jsonDatabase.hover(textDocument.uri, position);
    return hoverResults;
}
