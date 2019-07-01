import { InitializeLSIFDataBaseArguments, Event, Request } from "../protocol";
import logger, { Logger } from "../logger";
import { register } from "../register";

class InitializeHandler {
    constructor(
        private logger: Logger
    ) {
    }

    public handler(message: InitializeLSIFDataBaseArguments) {
        logger.debug(JSON.stringify(message));
        // @TODO
    }
}

const initializer = new InitializeHandler(logger);

register<InitializeLSIFDataBaseArguments>(Event.Request, Request.INITIALIZE, initializer.handler);
