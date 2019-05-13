import ws from "ws";

import logger from "./logger";

const wss = new ws.Server({
    port: 8088,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
    }
});

wss.addListener("listening", () => {
    logger.log("Start websocket server in 8088.");
});

wss.on("connection", (websocket) => {
    websocket.addEventListener("message", (e) => {
        const { data } = e;
        const rpcMessage = JSON.parse(data);
        const { type } = rpcMessage;
        switch (type) {
            case "notification":
                // @todo
            case "request":
                // @todo
            default:
                logger.error(`Unknow message type: ${type}`);
        }
    });
});
