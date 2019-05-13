import * as sqlite from "sqlite3";

import logger from "./logger";

const sqlite3 = sqlite.verbose();

const db = new sqlite3.Database("lsif");

db.serialize(() => {
    logger.log("create table if not exists");
    db.run("CREATE TABLE IF NOT EXISTS lsifIndex (project TEXT, value TEXT)");
});

export { db };
