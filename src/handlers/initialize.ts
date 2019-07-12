import * as path from 'path';
import * as cp from 'child_process';
import gitUrlParse from 'git-url-parse';
import * as fse from 'fs-extra';
import { clone, git } from 'dugite-extra';

import { ensureDirExist, findTsConfigFile } from 'src/utils';
import { InitializeRequest } from 'src/connection/protocol';
import { jsonDatabase } from 'src/dataBase';
import logger from 'src/logger';

function initializeLSIFDump(fsPath: string, projectPath: string, tsconfigPath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
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
        logger.log(`tsconfig path ${tsconfigPath}`);

        const childProcess = cp.fork(executorFile, lsifArgs, { cwd: projectPath, silent: true });
        const writeStream = fse.createWriteStream(fsPath);

        if (childProcess.stdout) {
            childProcess.stdout.pipe(writeStream);
        }
        
        childProcess.addListener('error', (err) => {
            logger.error(err.message);
        });

        writeStream.addListener('finish', () => {
            resolve(true);
        });
    });
}

export async function initialize(args: InitializeRequest): Promise<boolean> {
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
    if (versionResult.exitCode === 0) {
        version = versionResult.stdout;
        const dumpFilePath = path.join(dumpPath, `${version}.lsif`);
        const tsconfigFiles = await findTsConfigFile(projectPath);

        if(tsconfigFiles.length === 0) {
            return false;
        }
        console.log(tsconfigFiles);
        const initialized = await initializeLSIFDump(dumpFilePath, projectPath, tsconfigFiles[0]);
        if (initialized) {
            await jsonDatabase.load(dumpFilePath);
            return true;
        }
        return false;
    }
    return false;
}
