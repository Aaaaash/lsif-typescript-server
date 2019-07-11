import { HoverRequest } from 'src/connection/protocol';
import { jsonDatabase } from 'src/dataBase';

export function hover(args: HoverRequest): string {
    const { arguments: { textDocument, position } } = args;
    const hoverResults = jsonDatabase.hover(textDocument.uri, position);
    return JSON.stringify(hoverResults);
}
