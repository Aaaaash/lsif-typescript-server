import * as path from 'path';
import * as cp from 'child_process';
import gitUrlParse from 'git-url-parse';
import * as fse from 'fs-extra';
import { clone, git, checkout, fetch } from 'dugite-extra';

import { ensureDirExist, findTsConfigFile } from 'src/utils';
import { InitializeRequest } from 'src/connection/protocol';
import { withDB } from 'src/dbCache';
import logger from 'src/logger';
import { DB_STORAGE_PATH } from 'src/constants';

function generateDumpFile(
    dumpFilePath: string,
    projectPath: string,
    tsconfigPath: string,
): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        if (fse.pathExistsSync(dumpFilePath)) {
            resolve(true);
            return;
        }

        const executorFile = path.resolve(
            process.cwd(),
            'node_modules',
            'lsif-tsc',
            'bin',
            'lsif-tsc'
        );
        const lsifArgs = [
            '-p',
            tsconfigPath,
            '--stdout'
        ];
        logger.log(`TypeScript CompilerOptions fils path: ${tsconfigPath}`);

        const options = {
            cwd: projectPath,
            silent: true,
            execArgv: [
                '--max-old-space-size=32384'
            ],
        };
        const childProcess = cp.fork(executorFile, lsifArgs, options);
        const writeStream = fse.createWriteStream(dumpFilePath);

        if (childProcess.stdout) {
            childProcess.stdout.pipe(writeStream);
        }

        childProcess.addListener('error', (err) => {
            logger.error(err.message);
            reject(err.message);
        });

        writeStream.addListener('finish', () => {
            resolve(true);
        });
    });
}

export async function initialize(
    args: InitializeRequest
): Promise<{ initialized: true; commit: string } | { initialized: false; message: string }> {
    const { arguments: { url, commit, repository } } = args;
    const { owner, organization, name } = gitUrlParse(url);

    process.env['USE_LOCAL_GIT'] = 'true';

    ensureDirExist([owner || organization, name], path.resolve(process.cwd(), '.gitrepo'));

    const projectPath = path.join(process.cwd(), '.gitrepo', owner || organization, name);

    try {
        await clone(url, projectPath);
    } catch (err) {
        logger.error(err.message);
    }

    let version;

    await fetch(projectPath, 'origin');

    await checkout(projectPath, [], commit);

    const versionResult = await git(['rev-parse', 'HEAD'], projectPath, '');
    version = versionResult.stdout.trim();

    const dumpFilePath = path.join(DB_STORAGE_PATH, `${repository}@${version}.lsif`);
    const tsconfigFiles = await findTsConfigFile(projectPath);

    if (tsconfigFiles.length === 0) {
        logger.warn('Initialize failed, Can not found any TypeScript Compiler Options file.');
        return {
            initialized: false,
            message: 'Can not found any TypeScript Compiler Options file.',
        };
    }

    try {
        await generateDumpFile(dumpFilePath, projectPath, tsconfigFiles[0]);
        logger.debug('Dump file generate success.');

        logger.debug('Cache database.');
        await withDB(repository, version);

        return { initialized: true, commit: version };
    } catch(err) {
        logger.warn(`initialize failed, reason: ${err.message}`);
        return {
            initialized: false,
            message: err.message,
        };
    }
}
