import * as path from 'path';
import * as cp from 'child_process';
import gitUrlParse from 'git-url-parse';
import * as fse from 'fs-extra';
import { clone, git } from 'dugite-extra';

import { ensureDirExist, findTsConfigFile } from 'src/utils';
import { InitializeRequest } from 'src/connection/protocol';
import { jsonDatabase } from 'src/dataBase';
import logger from 'src/logger';

function generateDumpFile(dumpFilePath: string, projectPath: string, tsconfigPath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
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

export async function initialize(args: InitializeRequest): Promise<{ initialized: true } | { initialized: false; message: string }> {
    const { arguments: { url, commit } } = args;
    const { owner, organization, name } = gitUrlParse(url);

    process.env['USE_LOCAL_GIT'] = 'true';

    ensureDirExist([owner || organization, name], path.resolve(process.cwd(), '.gitrepo'));
    ensureDirExist([owner || organization, name], path.resolve(process.cwd(), '.dumps'));

    const projectPath = path.join(process.cwd(), '.gitrepo', owner || organization, name);
    const dumpPath = path.join(process.cwd(), '.dumps', owner || organization, name);

    try {
        await clone(url, projectPath);
    } catch (err) {
        logger.error(err.message);
    }

    let version;

    if (commit && commit !== 'HEAD' || commit !== 'master') {
        version = commit;
    } else {
        const versionResult = await git(['rev-parse', 'HEAD'], projectPath, '');
        if (versionResult.exitCode === 0) {
            version = versionResult.stdout;
        }
    }

    const dumpFilePath = path.join(dumpPath, `${version}.lsif`);
    const tsconfigFiles = await findTsConfigFile(projectPath);

    if (tsconfigFiles.length === 0) {
        return {
            initialized: false,
            message: 'Can not found any TypeScript Compiler Options file.',
        };
    }

    try {
        const initialized = await generateDumpFile(dumpFilePath, projectPath, tsconfigFiles[0]);
        if (initialized) {
            await jsonDatabase.load(dumpFilePath);
            return { initialized: true };
        }
    } catch(err) {
        console.log(`initialize failed, reason: ${err.message}`);
        return {
            initialized: false,
            message: err.message,
        };
    }
    return { initialized: true };
}
