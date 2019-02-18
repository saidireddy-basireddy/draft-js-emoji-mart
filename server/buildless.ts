import * as shell from 'shelljs';
import * as fs from 'fs';
import * as chalkc from 'chalk';
let chalk = chalkc as any;

const key = 'lessfile:';

let entry = process.argv.find(x => x.startsWith(key));
let lessFile = entry.replace('lessfile:', '');
let PathIndex = lessFile.lastIndexOf('.less');
let basePath = lessFile.slice(0, PathIndex);
let cssPath = basePath + '.css';

shell.exec(`lessc ${lessFile} ${cssPath}`);
shell.exec(`tcm -p ${cssPath}`);
fs.rename(`${cssPath}.d.ts`, `${basePath}.less.d.ts`, (err) => {
    if (err) {
        // tslint:disable-next-line:no-console
        console.log(chalk.red('error creating css module defenition', err));
    } else {
        fs.unlink(cssPath);
        // tslint:disable-next-line:no-console
        console.log(chalk.cyan('defenition file updated'));

    }
 });




