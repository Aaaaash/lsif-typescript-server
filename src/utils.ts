import * as path from 'path';
import glob from 'glob';
import * as fse from 'fs-extra';

import logger from './logger';
import { DB_STORAGE_PATH } from './constants';

export function ensureDirExist(paths: string[], absolutePath: string): void {
    let base = '';
    for (const p of paths) {
        base += `${p}/`;
        if (!fse.existsSync(path.join(absolutePath, base))) {
            fse.mkdirSync(path.join(absolutePath, base));
        }
    }
}

export function findTsConfigFile(directory: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        glob('tsconfig*json', { cwd: directory }, (err: Error | null, matches: string[]) => {
            if (err !== null) {
                logger.error(`Can not find any tsconfig file in ${directory}`);
                reject(`Can not find any tsconfig file in ${directory}`);
            }

            resolve(matches);
        });
    });
}

export function textDocumentUriTransfromer(
    uri: string,
    projectRoot: string,
): string {
    return path.join(projectRoot, uri);
}

export function isMasterOrHead(version: string): boolean {
    return version === 'master' || version === 'HEAD';
}

export function diskFile(repository: string, commit: string): string {
    return path.join(DB_STORAGE_PATH, `${repository}@${commit}.lsif`);
}

export function checkCommit(commit: any): void {
    if (typeof commit !== 'string' || commit.length !== 40 || !/^[0-9a-f]+$/.test(commit)) {
        throw Object.assign(new Error('Must specify the commit as a 40 character hash ' + commit), { status: 400 });
    }
}

export function checkRepository(repository: any): void {
    if (typeof repository !== 'string') {
        throw Object.assign(new Error('Must specify the repository (usually of the form github.com/user/repo)'), {
            status: 400,
        });
    }
}
