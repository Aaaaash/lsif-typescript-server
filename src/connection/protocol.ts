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
