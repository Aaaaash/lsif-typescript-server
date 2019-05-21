import { Event, Message } from "./protocol";
import logger from "./logger";

const notificationMap = new Map<string, Function>();
const requestMap = new Map<string, Function>();

function register<T>(type: Event, method: string, handler: (args: T) => any) {
    if (type === Event.Request) {
        requestMap.set(method, handler);
    } else if (type === Event.Notification) {
        notificationMap.set(method, handler);
    } else {
        logger.error(`Unknow message type: ${type}, method: ${method}`);
    }
}

export {
    register,
    requestMap,
    notificationMap,
};
