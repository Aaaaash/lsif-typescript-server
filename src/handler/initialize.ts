import { InitializeLSIFDataBaseArguments } from "../protocol";
import { Logger } from "../logger";

class InitializeHandler {
    constructor (
        private logger: Logger
    ) {
    }

    public handler(message: InitializeLSIFDataBaseArguments) {
        // @TODO
    }
}

export default InitializeHandler;
