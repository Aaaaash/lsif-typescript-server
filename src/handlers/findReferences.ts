import { FindReferencesRequest } from 'src/connection/protocol';
import { jsonDatabase } from 'src/dataBase';

export function findReferences(args: FindReferencesRequest): string {
    const { arguments: { textDocument, position } } = args;
    const context = {
        includeDeclaration: true,
    };
    const references = jsonDatabase.references(textDocument.uri, position, context);
    console.log(JSON.stringify(references));
    return JSON.stringify(references);
}
