import * as ts from "typescript";

export enum Request {
    INITIALIZE = "initialize",    
}

export interface InitializeLSIFDataBaseArguments {
    projectName: string;
    gitRepourl: string;
    tsconfig: ts.CompilerOptions;
}

export interface InitializeLSIFDataBaseRequest {
    method: Request.INITIALIZE;
    arguments: InitializeLSIFDataBaseArguments;
}
