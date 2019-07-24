import { jsonDatabase } from 'src/jsonDatabase';
import { GotoDefinitionRequest } from 'src/connection/protocol';
import { lsp } from 'lsif-protocol';

export function gotoDefinition(args: GotoDefinitionRequest): lsp.Location[] | undefined {
    const { arguments: { textDocument, position } } = args;
    const definition = jsonDatabase.gotoDefinition(textDocument.uri, position);
    return definition;
}
