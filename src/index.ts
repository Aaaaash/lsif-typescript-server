import ws from "ws";

import logger from "./logger";
import { InitializeLSIFDataBaseRequest, InitializeLSIFDataBaseArguments, Event } from "./protocol";
import { requestMap, notificationMap } from "./register";
import "./handler/initialize";

const wss = new ws.Server({
    port: 8088,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024,
    }
});

wss.addListener("listening", () => {
    logger.log("Start websocket server in 8088.");
});

wss.on("connection", (websocket: ws) => {
    websocket.addEventListener("message", (e: any) => {
        const { data } = e;
        const rpcMessage: InitializeLSIFDataBaseRequest<InitializeLSIFDataBaseArguments> = JSON.parse(data);
        const { type } = rpcMessage;
        logger.debug(`[Event] - Receive ${type} ${rpcMessage.method}, arguments: ${JSON.stringify(rpcMessage.arguments)}`);
        switch (type) {
            case Event.Notification:
                break;
            case Event.Request:
                const handler = requestMap.get(rpcMessage.method);
                if (handler) {
                    const response = handler(rpcMessage.arguments);
                    console.log(response);
                }
                break;
            default:
                logger.error(`Unknow message type: ${type}`);
        }
    });
});
