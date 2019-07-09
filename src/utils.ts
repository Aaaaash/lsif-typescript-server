import * as path from 'path';
import * as fse from 'fs-extra';

export function ensureDirExist(paths: string[], absolutePath: string): void {
    let base = '';
    for (const p of paths) {
        base += `${p}/`;
        if (!fse.existsSync(path.join(absolutePath, base))) {
            fse.mkdirSync(path.join(absolutePath, base));
        }
    }
}
