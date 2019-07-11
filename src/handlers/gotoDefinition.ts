import { jsonDatabase } from 'src/dataBase';
import { GotoDefinitionRequest } from 'src/connection/protocol';

export function gotoDefinition(args: GotoDefinitionRequest): string {
    const { arguments: { textDocument, position } } = args;
    const defintion = jsonDatabase.gotoDefinition(textDocument.uri, position);
    return JSON.stringify(defintion);
}
