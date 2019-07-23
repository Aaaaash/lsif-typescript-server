import * as path from 'path';
import glob from 'glob';
import * as fse from 'fs-extra';
import logger from './logger';

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

export function textDocumentUriTransfromer(uri: string, projectRoot: string): string {
    logger.debug(`Transfromer textDocument ${uri} to ${path.join(projectRoot, uri)}`);
    return path.join(projectRoot, uri);
}

export function isMasterOrHead(version: string): boolean {
    return version === 'master' || version === 'HEAD';
}