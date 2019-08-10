const path = require('path');
const fse = require('fs-extra');

const lsifPath = path.resolve(__dirname, 'node_modules', 'lsif-tsc');
const pkgJsonPath = path.join(lsifPath, 'package.json');

function copyTask(source, target) {
    return new Promise((resolve, reject) => {
        console.log(`Copy ${source}...`);
        fse.copySync(source, target);
        resolve();
    });
}

function run() {
    const pkgJson = JSON.parse(fse.readFileSync(pkgJsonPath).toString());
    const dependencies = pkgJson.dependencies;
    const targetPath = path.join(__dirname, 'out', 'node_modules');
    const copySelf = copyTask(lsifPath, path.join(targetPath, 'lsif-tsc'));

    const copyTasks = Object.keys(dependencies).map((dependency) => {
        const maybeExist = path.join(lsifPath, 'node_modules', dependency);
        if (fse.pathExistsSync(maybeExist)) {
            return Promise.resolve();
        }

        return copyTask(
            path.join('node_modules', dependency),
            path.join(targetPath, dependency),
        );
    });

    Promise.all([...copyTasks, copySelf])
        .then(() => {
            console.log('Done.');
            process.exit();
        });
}

run();
