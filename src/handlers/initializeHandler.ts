import * as path from 'path';
import * as cp from 'child_process';
import gitUrlParse from 'git-url-parse';
import * as fse from 'fs-extra';
import { clone, git } from 'dugite-extra';

import { ensureDirExist } from 'src/utils';
import { InitializeRequest } from 'src/connection/protocol';
import logger from 'src/logger';

export default async function initializeHandler(args: InitializeRequest): Promise<string> {
    const { arguments: { projectName, url } } = args;
    const { owner, organization, name, href } = gitUrlParse(url);

    process.env['USE_LOCAL_GIT'] = 'true';

    ensureDirExist([owner || organization, name], path.resolve(process.cwd(), '.gitrepo'));
    ensureDirExist([owner || organization, name], path.resolve(process.cwd(), '.dumps'));

    const projectPath = path.join(process.cwd(), '.gitrepo', owner || organization, name);
    const dumpPath = path.join(process.cwd(), '.dumps', owner || organization, name);

    try {
        await clone(url, projectPath);
    } catch(err) {
        logger.error(err.message);
    }

    let version;
    const versionResult = await git(['rev-parse', 'HEAD'], projectPath, '');
    return new Promise((resolve) => {
        if (versionResult.exitCode === 0) {
            version = versionResult.stdout;
            try {
                const executorFile = path.resolve(
                    process.cwd(),
                    'node_modules',
                    'lsif-tsc',
                    'bin',
                    'lsif-tsc'
                );
                const lsifArgs = [
                    '-p',
                    './tsconfig.json'
                ];
                logger.debug(`tsconfig file path: ${path.join(projectPath, 'tsconfig.json')}`);

                const childProcess = cp.fork(executorFile, lsifArgs, { cwd: projectPath, silent: true });
                const writeStream = fse.createWriteStream(path.join(dumpPath, version))

                if (childProcess.stdout) {
                    childProcess.stdout.pipe(writeStream);
                }
                
                childProcess.addListener('error', (err) => {
                    logger.error(err.message);
                });

                writeStream.addListener('finish', () => {
                    resolve('Initialized');
                });                
            } catch(err) {
                logger.error(err.message);
            }
        }
    })

}
