import LRU from 'lru-cache';
import * as fs from 'fs';

import { JsonDatabase } from './jsonDatabase';
import { diskFile } from './utils';

interface LRUDBEntry {
    dbPromise: Promise<JsonDatabase>;
    length: number;
    dispose: () => void;
}

const DBCache = new LRU<string, LRUDBEntry>({
    max: 100 * 1024 * 1024,
    length: (entry, key) => entry.length,
    dispose: (key, entry) => entry.dispose(),
});

async function createDatabase(dumpFilePath: string): Promise<JsonDatabase> {
    const db = new JsonDatabase();
    await db.load(dumpFilePath);
    return db;
}

export const withDB = async (repository: string, commit: string): Promise<JsonDatabase> => {
    const entry = DBCache.get(`${repository}@${commit}`);
    if (entry) {
        return entry.dbPromise;
    } else {
        const dumpFilePath = diskFile(repository, commit);
        const length = await fs.statSync(dumpFilePath).size;
        const promiseifyDB = createDatabase(dumpFilePath);

        DBCache.set(`${repository}@${commit}`, {
            dbPromise: promiseifyDB,
            length,
            dispose: () => promiseifyDB.then((db) => db.close()),
        });

        return promiseifyDB;
    }
}
