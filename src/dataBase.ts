import { Id,
    Vertex,
    Document,
    Range,
    Project,
    ItemEdgeProperties,
    ReferenceResult,
    ResultSet,
    DocumentSymbolResult,
    FoldingRangeResult,
    DefinitionResult,
    TypeDefinitionResult,
    HoverResult,
    ImplementationResult,
    DeclarationResult,
    DiagnosticResult,
    DocumentLinkResult
} from 'lsif-protocol';
import logger from './logger';

interface Vertices {
    all: Map<Id, Vertex>;
    projects: Map<Id, Project>;
    documents: Map<Id, Document>;
    ranges: Map<Id, Range>;
}

type ItemTarget =
	Range |
	{ type: ItemEdgeProperties.declarations; range: Range } |
	{ type: ItemEdgeProperties.definitions; range: Range } |
	{ type: ItemEdgeProperties.references; range: Range } |
	{ type: ItemEdgeProperties.referenceResults; result: ReferenceResult };

interface Indices {
    documents: Map<string, Document>;
}

interface Out {
    contains: Map<Id, Document[] | Range[]>;
    item: Map<Id, ItemTarget[]>;
    next: Map<Id, ResultSet>;
    documentSymbol: Map<Id, DocumentSymbolResult>;
    foldingRange: Map<Id, FoldingRangeResult>;
    documentLink: Map<Id, DocumentLinkResult>;
    diagnostic: Map<Id, DiagnosticResult>;
    declaration: Map<Id, DeclarationResult>;
    definition: Map<Id, DefinitionResult>;
    typeDefinition: Map<Id, TypeDefinitionResult>;
    hover: Map<Id, HoverResult>;
    references: Map<Id, ReferenceResult>;
    implementation: Map<Id, ImplementationResult>;
}

interface In {
	contains: Map<Id, Project | Document>;
}

class JsonDataBase {

    private vertices: Vertices;

    private indices: Indices;

    private out: Out;

    private in: In;

    constructor() {
        this.vertices = {
            all: new Map(),
            projects: new Map(),
            documents: new Map(),
            ranges: new Map()
        };

        this.indices = {
            documents: new Map()
        };

        this.out = {
            contains: new Map(),
            item: new Map(),
            next: new Map(),
            documentSymbol: new Map(),
            foldingRange: new Map(),
            documentLink: new Map(),
            diagnostic: new Map(),
            declaration: new Map(),
            definition: new Map(),
            typeDefinition: new Map(),
            hover: new Map(),
            references: new Map(),
            implementation: new Map()
        };

        this.in = {
            contains: new Map()
        }
    }

    public load(fsPath: string): void {
        logger.debug(`Dump file path: ${fsPath}`);
        // load lsif file
    }
}

export const jsonDatabase = new JsonDataBase();
