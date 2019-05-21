import * as ts from "typescript";

export enum Event {
    Request = "request",
    Notification = "notification",
}


export enum Request {
    INITIALIZE = "initialize",    
}

export enum Notification {

}

export interface Message<T> {
    type: Event;
    method?: Request;
    notifyType?: Notification;
    arguments: T;
}

export interface InitializeLSIFDataBaseArguments {
    projectName: string;
    gitRepourl: string;
    tsconfig: ts.CompilerOptions;
}

export interface InitializeLSIFDataBaseRequest<T> extends Message<T> {
    method: Request.INITIALIZE;
    arguments: T;
}
