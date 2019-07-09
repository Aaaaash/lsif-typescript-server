export enum Event {
    Request = 'request',
    Notification = 'notification',
    Response = 'response',
}

export enum Request {
    INITIALIZE = 'initialize',
}

export enum Notification {

}

export interface Message<T> {
    type: Event;
    id: number;
    method?: Request;
    notifyType?: Notification;
    arguments: T;
}

export interface InitializeArguments {
    projectName: string;
    url: string;
};

export type InitializeRequest = Message<InitializeArguments>;
